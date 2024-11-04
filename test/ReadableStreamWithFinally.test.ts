import { expect } from 'chai'
import { ReadableStreamWithFinally } from '../src/index'
import slurp from './slurp'

describe(`ReadableStreamWithFinally`, function () {
  describe(`start()`, function () {
    it(`start() returns, sync close`, async function () {
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
    it(`start() resolves, sync close`, async function () {
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
    it(`start() closes sync, sync close`, async function () {
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
    it(`start() closes async, sync close`, async function () {
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

    it(`start() throws, sync close`, async function () {
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
    it(`start() throws, async close`, async function () {
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
    it(`start() rejects, sync close`, async function () {
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
    it(`start() rejects, async close`, async function () {
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
    it(`pull() closes sync, sync close`, async function () {
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
    it(`pull() closes async, sync close`, async function () {
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

    it(`pull() throws, sync close`, async function () {
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
    it(`pull() throws, async close`, async function () {
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
    it(`pull() rejects, sync close`, async function () {
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
    it(`pull() rejects, async close`, async function () {
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
    it(`no cancel on source, sync close`, async function () {
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
    it(`no cancel on source, async close`, async function () {
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

    it(`cancel() returns, sync close`, async function () {
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
    it(`cancel() resolves, async close`, async function () {
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
    it(`cancel() throws, sync close`, async function () {
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
    it(`cancel() throws, async close`, async function () {
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
    it(`cancel() rejects, sync close`, async function () {
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
    it(`cancel() rejects, async close`, async function () {
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
