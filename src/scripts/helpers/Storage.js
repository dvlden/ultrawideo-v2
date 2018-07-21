// Future reference:
// window.navigator.userAgent.includes('Edge')
// When Edge starts supporting "object-fit" on videos, I should check for the snippet above
// in "get()"" method, within "if" statement, cause at this point, Edge's API is incorrect
// and expects callback as second argument. It's exactly the same as Chrome's API, but uses
// "browser" instead of "chrome". Weird bug, good job Edge.
// Your suck, just like all of your ancestors! 👏

import browserApi from './browserApi'

export default class Storage {
  constructor (type = 'local') {
    this.api = browserApi.resolve().storage
    this.store = this.api[type]
  }

  get (keys) {
    if (browserApi.isChrome()) {
      return new Promise(resolve => {
        this.store.get(keys, result => resolve(result))
      })
    }

    return this.store.get(keys)
  }

  set (keys) {
    if (browserApi.isChrome()) {
      return new Promise(resolve => {
        this.store.set(keys, () => resolve())
      })
    }

    return this.store.set(keys)
  }

  listener (callback) {
    if (!callback instanceof Function) return

    this.api.onChanged.addListener(
      changes => callback.call(null, changes)
    )
  }
}
