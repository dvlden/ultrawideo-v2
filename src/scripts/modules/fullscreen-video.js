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

    /** Attempt to get correct video element
    * Amazon Prime: has two video elements (unknown, content)
    * Hulu: has three video elements (intro, ad, content)
    */
    return Array.from(element.querySelectorAll('video')).filter(
      element => element.src || element.currentSrc
    )[0]
  }
}

export default FullscreenVideo
