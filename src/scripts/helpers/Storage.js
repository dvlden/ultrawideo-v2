const isChrome = () => typeof chrome !== 'undefined'

export default class Storage {
  constructor (type = 'local') {
    this.api = (chrome || browser).storage
    this.store = this.api[type]
  }

  get (keys) {
    if (isChrome) {
      return new Promise(resolve => {
        this.store.get(keys, result => resolve(result))
      })
    }

    return this.store.get(keys)
  }

  set (keys) {
    if (isChrome) {
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



