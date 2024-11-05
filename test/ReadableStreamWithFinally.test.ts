import { expect } from 'chai'
import { ReadableStreamWithFinally } from '../src/index'
import slurp from './slurp'

describe(`ReadableStreamWithFinally`, function () {
  describe(`start()`, function () {
    it(`start() returns, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          start(controller) {
            controller.enqueue(1)
          },
          pull(controller) {
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })
    it(`start() resolves, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          async start(controller) {
            controller.enqueue(1)
          },
          pull(controller) {
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })
    it(`start() closes sync, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          start(controller) {
            controller.enqueue(1)
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })
    it(`start() closes async, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          async start(controller) {
            controller.enqueue(1)
            await Promise.resolve()
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })

    it(`start() throws, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start() {
              throw new Error('test')
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() throws, async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start() {
              throw new Error('test')
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() calls controller.error(), sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start(controller) {
              controller.error(new Error('test'))
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() calls controller.error(), async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start(controller) {
              controller.error(new Error('test'))
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() rejects, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async start() {
              throw new Error('test')
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() rejects, async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async start() {
              throw new Error('test')
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`pull()`, function () {
    it(`sync close and enqueue`, async function () {
      let closed: any
      const stream = new ReadableStreamWithFinally({
        pull(controller) {
          controller.close()
          controller.enqueue('foo')
        },
        async finally(...args) {
          closed = args
        },
      })
      await slurp(stream)
      expect(closed).to.deep.equal([
        'error',
        Object.assign(
          new TypeError('Invalid state: Controller is already closed'),
          { code: 'ERR_INVALID_STATE' }
        ),
      ])
    })
    it(`async close and enqueue`, async function () {
      let closed: any
      const stream = new ReadableStreamWithFinally({
        async pull(controller) {
          controller.close()
          controller.enqueue('foo')
        },
        async finally(...args) {
          closed = args
        },
      })
      await slurp(stream)
      expect(closed).to.deep.equal([
        'error',
        Object.assign(
          new TypeError('Invalid state: Controller is already closed'),
          { code: 'ERR_INVALID_STATE' }
        ),
      ])
    })

    it(`pull() closes sync, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          pull(controller) {
            controller.enqueue(1)
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })
    it(`pull() closes async, sync finally`, async function () {
      let closed: any
      const result = await slurp(
        new ReadableStreamWithFinally({
          async pull(controller) {
            controller.enqueue(1)
            await Promise.resolve()
            controller.close()
          },
          finally(...args) {
            closed = args
          },
        })
      )
      expect(closed).to.deep.equal(['close', undefined])
      expect(result).to.deep.equal([1])
    })

    it(`pull() throws, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull() {
              throw new Error('test')
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() throws, async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull() {
              throw new Error('test')
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() calls controller.error(), sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull(controller) {
              controller.error(new Error('test'))
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() calls controller.error(), async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull(controller) {
              controller.error(new Error('test'))
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() rejects, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async pull() {
              throw new Error('test')
            },
            finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() rejects, async finally`, async function () {
      let error: any
      let closed: any
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async pull() {
              throw new Error('test')
            },
            async finally(...args) {
              closed = args
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`cancel()`, function () {
    it(`no cancel on source, sync finally`, async function () {
      let closed: any
      const stream = new ReadableStreamWithFinally({
        finally(...args) {
          closed = args
        },
      })
      stream.cancel()
      expect(await slurp(stream)).to.deep.equal([])
      expect(closed).to.deep.equal(['cancel', undefined])
    })
    it(`no cancel on source, async finally`, async function () {
      let closed: any
      const stream = new ReadableStreamWithFinally({
        async finally(...args) {
          closed = args
        },
      })
      stream.cancel()
      expect(await slurp(stream)).to.deep.equal([])
      expect(closed).to.deep.equal(['cancel', undefined])
    })

    it(`cancel() returns, sync finally`, async function () {
      let canceled = false
      let closed: any
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
        },
        finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
    it(`cancel() resolves, async finally`, async function () {
      let closed: any
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
        },
        async finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
    it(`cancel() throws, sync finally`, async function () {
      let canceled = false
      let closed: any
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
    it(`cancel() throws, async finally`, async function () {
      let closed: any
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        async finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
    it(`cancel() rejects, sync finally`, async function () {
      let closed: any
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        async cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
    it(`cancel() rejects, async finally`, async function () {
      let closed: any
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        async cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        async finally(...args) {
          closed = args
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.deep.equal(['cancel', 'test'])
    })
  })
})
