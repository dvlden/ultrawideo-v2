import browser from 'webextension-polyfill'
import { settingsKeys } from '@/static/defaults'

class Storage {
  constructor (area = 'local') {
    this.storage = browser.storage[area]
    this._data = {}
  }

  set (object) {
    this.storage.set(object)
  }

  get (any) {
    return this.storage.get(any)
  }

  onChange (callback) {
    browser.storage.onChanged.addListener(callback)
  }

  async syncData () {
    this._data = await this.get(settingsKeys)
    return Promise.resolve(this._data)
  }

  set data (object) {
    this._data = object
  }

  get data () {
    return this._data
  }
}

export default Storage
