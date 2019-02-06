import api from './api'

export default class FullScreen {
  constructor () {
    this.api = api
    this.onChangeCallback = null
  }

  onChange (callback) {
    if (! callback instanceof Function) return
    this.onChangeCallback = callback.bind(null, this.api.el)
  }

  listenEvent () {
    ['', 'webkit', 'moz'].forEach(prefix => {
      document.addEventListener(prefix + 'fullscreenchange', this.onChangeCallback, false)
    })
  }

  destroyEvent () {
    ['', 'webkit', 'moz'].forEach(prefix => {
      document.removeEventListener(prefix + 'fullscreenchange', this.onChangeCallback, false)
    })
  }
}
