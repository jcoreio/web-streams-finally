interface UnderlyingSinkFinallyCallback {
  (why: 'close' | 'abort' | 'error', reason?: any): void | PromiseLike<void>
}

export interface UnderlyingSinkWithFinally<W = any> extends UnderlyingSink<W> {
  finally: UnderlyingSinkFinallyCallback
}

export class WritableStreamWithFinally<W = any> extends WritableStream<W> {
  constructor(
    underlyingSink: UnderlyingSinkWithFinally<W>,
    strategy?: QueuingStrategy<W>
  ) {
    super(new WritableStreamCleanupHandler<W>(underlyingSink), strategy)
  }
}

class WritableStreamCleanupHandler<W = any> implements UnderlyingSink<W> {
  declare abort?: UnderlyingSink<W>['abort']
  declare close?: UnderlyingSink<W>['close']
  declare start?: UnderlyingSink<W>['start']
  declare write?: UnderlyingSink<W>['write']

  constructor(private underlyingSink: UnderlyingSinkWithFinally<W>) {
    let wrappedController: WritableStreamDefaultController | undefined
    let why: Parameters<UnderlyingSinkFinallyCallback>[0] | undefined
    let reason: any
    function wrapController(controller: WritableStreamDefaultController) {
      return (
        wrappedController ||
        (wrappedController = Object.create(controller, {
          error: {
            value: (error?: any) => {
              why = 'error'
              reason = error
              controller.error(error)
            },
          },
        }))
      )
    }
    let cleanupResult: [any] | undefined
    function cleanup(why: 'close' | 'abort' | 'error', reason?: any) {
      if (cleanupResult) return cleanupResult[0]
      cleanupResult = [underlyingSink.finally(why, reason)]
      return cleanupResult
    }
    function wrap<Args extends any[]>(
      fn: (...args: Args) => void | PromiseLike<void>
    ) {
      return (...args: Args) => {
        let result: any
        let error: any
        try {
          result = fn(...args)
        } catch (err) {
          error = err
          if (why !== 'abort') {
            reason = err
            why = 'error'
          }
        }
        if (isPromise<W>(result)) {
          return result
            .catch((error) => {
              if (why !== 'abort') {
                why = 'error'
                reason = error
              }
              throw error
            })
            .finally(async () => {
              if (why) {
                await cleanup(why, reason)
              }
            })
        }
        if (why) {
          const finallyResult = cleanup(why, reason)
          if (isPromise(finallyResult)) {
            return finallyResult.then(() => {
              if (error) throw error
              return result
            })
          }
        }
        if (error) {
          throw error
        }
        return result
      }
    }

    if (underlyingSink.start) {
      this.start = wrap((controller) =>
        underlyingSink.start?.(wrapController(controller))
      )
    }
    if (underlyingSink.write) {
      this.write = wrap((chunk, controller) =>
        underlyingSink.write?.(chunk, wrapController(controller))
      )
    }
    this.close = wrap(() => {
      why = 'close'
      return underlyingSink.close?.()
    })
    this.abort = wrap((_reason?: any) => {
      why = 'abort'
      reason = _reason
      return underlyingSink.abort?.(_reason)
    })
  }
}

function isPromise<T>(x: any): x is Promise<T> {
  return x != null && typeof x.then === 'function'
}
