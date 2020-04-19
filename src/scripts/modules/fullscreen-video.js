import Fullscreen from './fullscreen'
import hasBlob from '@/helpers/hasBlob'

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

    return Array.from(element.querySelectorAll('video')).filter(element => {
      if (/(amazon|primevideo|hulu)/.test(window.location.hostname)) {
        return hasBlob(element)
      }

      return (element.src || element.currentSrc)
    })[0]
  }
}

export default FullscreenVideo
