interface UnderlyingSourceFinallyCallback {
  (why: 'close' | 'cancel' | 'error', reason?: any): void | PromiseLike<void>
}

export interface UnderlyingDefaultSourceWithFinally<R = any>
  extends UnderlyingDefaultSource<R> {
  finally: UnderlyingSourceFinallyCallback
}

export interface UnderlyingByteSourceWithFinally extends UnderlyingByteSource {
  finally: UnderlyingSourceFinallyCallback
}

export type UnderlyingSourceWithFinally<R = any> =
  | UnderlyingDefaultSourceWithFinally<R>
  | UnderlyingByteSourceWithFinally

/**
 * Wraps a ReadableStream to support a `finally` method on `underlyingSource` which
 * will be called once the stream is closing for any reason
 */
export class ReadableStreamWithFinally<R = any> extends ReadableStream<R> {
  constructor(
    underlyingSource: UnderlyingByteSourceWithFinally,
    strategy?: { highWaterMark?: number }
  )
  constructor(
    underlyingSource: UnderlyingDefaultSourceWithFinally<R>,
    strategy?: QueuingStrategy<R>
  )
  constructor(
    underlyingSource: UnderlyingSourceWithFinally<R>,
    strategy?: QueuingStrategy<R>
  ) {
    super(new ReadableStreamCleanupHandler<R>(underlyingSource), strategy)
  }
}

class ReadableStreamCleanupHandler<R = any> implements UnderlyingSource<R> {
  declare autoAllocateChunkSize: UnderlyingSource<R>['autoAllocateChunkSize']
  declare start: UnderlyingSource<R>['start']
  declare pull: UnderlyingSource<R>['pull']
  declare cancel: UnderlyingSource<R>['cancel']
  declare type: UnderlyingSource<R>['type']

  constructor(private underlyingSource: UnderlyingSourceWithFinally<R>) {
    Object.assign(this, underlyingSource)
    let wrappedController: ReadableStreamController<R> | undefined
    let why: Parameters<UnderlyingSourceFinallyCallback>[0] | undefined
    let reason: any
    function wrapController(controller: ReadableStreamController<R>) {
      return (
        wrappedController ||
        (wrappedController = Object.create(controller, {
          close: {
            value: () => {
              why = 'close'
              controller.close()
            },
          },
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
    function wrap<Arg>(fn: (controller: Arg) => void | PromiseLike<void>) {
      return (arg: Arg) => {
        let result: any
        let error: any
        try {
          result = fn(arg)
        } catch (err) {
          error = err
          if (why !== 'cancel') {
            reason = err
            why = 'error'
          }
        }
        if (isPromise<R>(result)) {
          return result
            .catch((error) => {
              if (why !== 'cancel') {
                why = 'error'
                reason = error
              }
              throw error
            })
            .finally(async () => {
              if (why) {
                await underlyingSource.finally(why, reason)
              }
            })
        }
        if (why) {
          const finallyResult = underlyingSource.finally(why, reason)
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

    if (underlyingSource.start) {
      this.start = wrap((controller: ReadableStreamController<R>) =>
        underlyingSource.start?.(wrapController(controller))
      )
    }
    if (underlyingSource.pull) {
      this.pull = wrap((controller: ReadableStreamController<R>) =>
        underlyingSource.pull?.(wrapController(controller))
      )
    }
    this.cancel = wrap((_reason?: any) => {
      why = 'cancel'
      reason = _reason
      return underlyingSource.cancel?.(_reason)
    })
  }
}

function isPromise<T>(x: any): x is Promise<T> {
  return x != null && typeof x.then === 'function'
}
