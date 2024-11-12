interface UnderlyingSourceFinallyCallback {
  (why: 'close' | 'cancel' | 'error', reason?: any): void | PromiseLike<void>
}

export interface UnderlyingDefaultSourceWithSignal<R = any> {
  cancel?: UnderlyingSourceCancelCallback
  pull?: (
    controller: ReadableStreamDefaultController<R> & { signal: AbortSignal }
  ) => void | PromiseLike<void>
  start?: (
    controller: ReadableStreamDefaultController<R> & { signal: AbortSignal }
  ) => any
  finally: UnderlyingSourceFinallyCallback
  type?: undefined
}

export interface UnderlyingByteSourceWithSignal {
  autoAllocateChunkSize?: number
  cancel?: UnderlyingSourceCancelCallback
  pull?: (
    controller: ReadableByteStreamController & { signal: AbortSignal }
  ) => void | PromiseLike<void>
  start?: (
    controller: ReadableByteStreamController & { signal: AbortSignal }
  ) => any
  finally: UnderlyingSourceFinallyCallback
  type: 'bytes'
}

export type UnderlyingSourceWithSignal<R = any> =
  | UnderlyingDefaultSourceWithSignal<R>
  | UnderlyingByteSourceWithSignal

/**
 * Wraps a ReadableStream to support a `finally` method on `underlyingSource` which
 * will be called once the stream is closing for any reason
 */
export class ReadableStreamWithSignal<R = any> extends ReadableStream<R> {
  constructor(
    underlyingSource: UnderlyingByteSourceWithSignal,
    strategy?: { highWaterMark?: number }
  )
  constructor(
    underlyingSource: UnderlyingDefaultSourceWithSignal<R>,
    strategy?: QueuingStrategy<R>
  )
  constructor(
    underlyingSource: UnderlyingSourceWithSignal<R>,
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

  constructor(private underlyingSource: UnderlyingSourceWithSignal<R>) {
    Object.assign(this, underlyingSource)
    const abortController = new AbortController()
    const { signal } = abortController
    let wrappedController:
      | (ReadableStreamController<R> & { signal: AbortSignal })
      | undefined
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
          signal: {
            value: signal,
          },
        }))
      )
    }
    let cleanupResult: [any] | undefined
    function cleanup(why: 'close' | 'cancel' | 'error', reason?: any) {
      if (cleanupResult) return cleanupResult[0]
      cleanupResult = [underlyingSource.finally(why, reason)]
      abortController.abort()
      return cleanupResult
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
