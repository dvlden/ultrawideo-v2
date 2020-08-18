import Fullscreen from './fullscreen'
import hasBlob from '@/helpers/hasBlob'

class FullscreenVideo extends Fullscreen {
  constructor () {
    super()
    this._cachedElement = null
  }

  filterWithBlobs (nodes) {
    return Array.from(nodes).filter(hasBlob)
  }

  filterWithSources (nodes) {
    return Array.from(nodes).filter(node => (
      node.src ||
      /* istanbul ignore next */ node.currentSrc
    ))
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

    const elements = element.querySelectorAll('video')

    const blobElements = this.filterWithBlobs(elements)
    if (blobElements.length) {
      return blobElements[0]
    }

    const srcElements = this.filterWithSources(elements)
    if (srcElements.length) {
      return srcElements[0]
    }

    // No video element, die silently...
    // Something might have requested fullscreen, but it's not the video.
  }
}

export default FullscreenVideo
