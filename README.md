# @jcoreio/web-streams-finally

userland implementation of proposed finally() API for web streams

[![CircleCI](https://circleci.com/gh/jcoreio/web-streams-finally.svg?style=svg)](https://circleci.com/gh/jcoreio/web-streams-finally)
[![Coverage Status](https://codecov.io/gh/jcoreio/web-streams-finally/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/web-streams-finally)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://badge.fury.io/js/%40jcoreio%2Fweb-streams-finally.svg)](https://badge.fury.io/js/%40jcoreio%2Fweb-streams-finally)

## `ReadableStreamWithFinally`

```ts
import { ReadableStreamWithFinally } from '@jcoreio/web-streams-finally'

const stream = new ReadableStreamWithFinally({
  async pull(controller) {
    ...
  },
  async finally(why: 'close' | 'cancel' | 'error', reason?: any) {
    // this will be called when the stream is closed, canceled, or errored
  }
})
```

## `ReadableStreamWithSignal`

```ts
import { ReadableStreamWithSignal } from '@jcoreio/web-streams-finally'

const stream = new ReadableStreamWithSignal({
  async pull(controller) {
    await doSomething({
      signal: controller.signal, // will be aborted when stream errors is closed, canceled, or errored
    })
    ...
  },
  async finally(why: 'close' | 'cancel' | 'error', reason?: any) {
    // this will be called when the stream is closed, canceled, or errored
  }
})
```
