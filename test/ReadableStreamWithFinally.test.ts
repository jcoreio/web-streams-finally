import { expect } from 'chai'
import { ReadableStreamWithFinally } from '../src/index'
import slurp from './slurp'

describe(`ReadableStreamWithFinally`, function () {
  describe(`start()`, function () {
    it(`start() returns, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          start(controller) {
            controller.enqueue(1)
          },
          pull(controller) {
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })
    it(`start() resolves, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          async start(controller) {
            controller.enqueue(1)
          },
          pull(controller) {
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })
    it(`start() closes sync, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          start(controller) {
            controller.enqueue(1)
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })
    it(`start() closes async, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          async start(controller) {
            controller.enqueue(1)
            await Promise.resolve()
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })

    it(`start() throws, sync close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start() {
              throw new Error('test')
            },
            finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() throws, async close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            start() {
              throw new Error('test')
            },
            async finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() rejects, sync close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async start() {
              throw new Error('test')
            },
            finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`start() rejects, async close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async start() {
              throw new Error('test')
            },
            async finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`pull()`, function () {
    it(`pull() closes sync, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          pull(controller) {
            controller.enqueue(1)
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })
    it(`pull() closes async, sync close`, async function () {
      let closed = false
      const result = await slurp(
        new ReadableStreamWithFinally({
          async pull(controller) {
            controller.enqueue(1)
            await Promise.resolve()
            controller.close()
          },
          finally() {
            closed = true
          },
        })
      )
      expect(closed).to.be.true
      expect(result).to.deep.equal([1])
    })

    it(`pull() throws, sync close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull() {
              throw new Error('test')
            },
            finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() throws, async close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            pull() {
              throw new Error('test')
            },
            async finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() rejects, sync close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async pull() {
              throw new Error('test')
            },
            finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`pull() rejects, async close`, async function () {
      let error: any
      let closed = false
      try {
        await slurp(
          new ReadableStreamWithFinally({
            async pull() {
              throw new Error('test')
            },
            async finally() {
              closed = true
            },
          })
        )
      } catch (err) {
        error = err
      }
      expect(closed).to.be.true
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`cancel()`, function () {
    it(`no cancel on source, sync close`, async function () {
      let closed = false
      const stream = new ReadableStreamWithFinally({
        finally() {
          closed = true
        },
      })
      stream.cancel()
      expect(await slurp(stream)).to.deep.equal([])
      expect(closed).to.be.true
    })
    it(`no cancel on source, async close`, async function () {
      let closed = false
      const stream = new ReadableStreamWithFinally({
        async finally() {
          closed = true
        },
      })
      stream.cancel()
      expect(await slurp(stream)).to.deep.equal([])
      expect(closed).to.be.true
    })

    it(`cancel() returns, sync close`, async function () {
      let canceled = false
      let closed = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
        },
        finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
    it(`cancel() resolves, async close`, async function () {
      let closed = false
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
        },
        async finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
    it(`cancel() throws, sync close`, async function () {
      let canceled = false
      let closed = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
    it(`cancel() throws, async close`, async function () {
      let closed = false
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        async finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
    it(`cancel() rejects, sync close`, async function () {
      let closed = false
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        async cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
    it(`cancel() rejects, async close`, async function () {
      let closed = false
      let canceled = false
      const stream = new ReadableStreamWithFinally({
        async cancel(reason) {
          expect(reason).to.equal('test')
          canceled = true
          throw new Error(reason)
        },
        async finally() {
          closed = true
        },
      })
      stream.cancel('test')
      await slurp(stream)
      expect(canceled).to.be.true
      expect(closed).to.be.true
    })
  })
})
