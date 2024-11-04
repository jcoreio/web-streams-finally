/* eslint-disable @typescript-eslint/no-unused-vars */
interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterator<R>
}
