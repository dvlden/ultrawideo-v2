import Fullscreen from './fullscreen'

class FullscreenVideo extends Fullscreen {
  constructor () {
    super()
    this._cachedElement = null
  }

  set cachedElement (element) {
    this._cachedElement = element
  }

  get cachedElement () {
    return this._cachedElement
  }

  get videoElement () {
    let element = this.element

    if (new RegExp(/(video)/i).test(element.nodeName)) {
      return element
    }

    return element.querySelector('video')
  }
}

export default FullscreenVideo
