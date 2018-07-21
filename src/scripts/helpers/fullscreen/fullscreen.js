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
    document.addEventListener(this.api.event, this.onChangeCallback, false)
  }

  destroyEvent () {
    document.removeEventListener(this.api.event, this.onChangeCallback, false)
  }
}
