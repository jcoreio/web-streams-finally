import { expect } from 'chai'
import { WritableStreamWithFinally } from '../src/WritableStreamWithFinally'

describe(`WritableStreamWithFinally`, function () {
  describe(`start()`, function () {
    it(`start() returns, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        start() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`start() resolves, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        async start() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`start() throws, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          start() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
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
        const stream = new WritableStreamWithFinally({
          start() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
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
        const stream = new WritableStreamWithFinally({
          start(controller) {
            controller.error(new Error('test'))
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
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
        const stream = new WritableStreamWithFinally({
          start(controller) {
            controller.error(new Error('test'))
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
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
        const stream = new WritableStreamWithFinally({
          async start() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
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
        const stream = new WritableStreamWithFinally({
          async start() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`write()`, function () {
    it(`write() returns, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        write() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`write() resolves, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        async write() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`write() throws, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          write() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`write() throws, async finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          write() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`write() calls controller.error(), sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        write(chunk, controller) {
          controller.error(new Error('test'))
        },
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      // this isn't rejecting, I think it's a bug with node
      await writer.write()
      expect(closed).to.deep.equal(['error', new Error('test')])
    })
    it(`write() calls controller.error(), async finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        write(chunk, controller) {
          controller.error(new Error('test'))
        },
        async finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      // this isn't rejecting, I think it's a bug with node
      await writer.write()
      expect(closed).to.deep.equal(['error', new Error('test')])
    })
    it(`write() rejects, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          async write() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`write() rejects, async finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          async write() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`close()`, function () {
    it(`close() returns, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        close() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`close() resolves, sync finally`, async function () {
      let closed: any
      const stream = new WritableStreamWithFinally({
        async close() {},
        finally(...args) {
          closed = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.close()
      expect(closed).to.deep.equal(['close', undefined])
    })
    it(`close() throws, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          close() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`close() throws, async finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          close() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`close() rejects, sync finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          async close() {
            throw new Error('test')
          },
          finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`close() rejects, async finally`, async function () {
      let error: any
      let closed: any
      try {
        const stream = new WritableStreamWithFinally({
          async close() {
            throw new Error('test')
          },
          async finally(...args) {
            closed = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.close()
      } catch (err) {
        error = err
      }
      expect(closed).to.deep.equal(['error', new Error('test')])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
  describe(`abort()`, function () {
    it(`abort() returns, sync finally`, async function () {
      let abortd: any
      const stream = new WritableStreamWithFinally({
        abort() {},
        finally(...args) {
          abortd = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.abort()
      expect(abortd).to.deep.equal(['abort', undefined])
    })
    it(`abort() resolves, sync finally`, async function () {
      let abortd: any
      const stream = new WritableStreamWithFinally({
        async abort() {},
        finally(...args) {
          abortd = args
        },
      })
      const writer = stream.getWriter()
      await writer.write()
      await writer.abort()
      expect(abortd).to.deep.equal(['abort', undefined])
    })
    it(`abort() throws, sync finally`, async function () {
      let error: any
      let abortd: any
      try {
        const stream = new WritableStreamWithFinally({
          abort() {
            throw new Error('test')
          },
          finally(...args) {
            abortd = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.abort()
      } catch (err) {
        error = err
      }
      expect(abortd).to.deep.equal(['abort', undefined])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`abort() throws, async finally`, async function () {
      let error: any
      let abortd: any
      try {
        const stream = new WritableStreamWithFinally({
          abort() {
            throw new Error('test')
          },
          async finally(...args) {
            abortd = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.abort()
      } catch (err) {
        error = err
      }
      expect(abortd).to.deep.equal(['abort', undefined])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`abort() rejects, sync finally`, async function () {
      let error: any
      let abortd: any
      try {
        const stream = new WritableStreamWithFinally({
          async abort() {
            throw new Error('test')
          },
          finally(...args) {
            abortd = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.abort()
      } catch (err) {
        error = err
      }
      expect(abortd).to.deep.equal(['abort', undefined])
      expect(error).to.deep.equal(new Error('test'))
    })
    it(`abort() rejects, async finally`, async function () {
      let error: any
      let abortd: any
      try {
        const stream = new WritableStreamWithFinally({
          async abort() {
            throw new Error('test')
          },
          async finally(...args) {
            abortd = args
          },
        })
        const writer = stream.getWriter()
        await writer.write()
        await writer.abort()
      } catch (err) {
        error = err
      }
      expect(abortd).to.deep.equal(['abort', undefined])
      expect(error).to.deep.equal(new Error('test'))
    })
  })
})
