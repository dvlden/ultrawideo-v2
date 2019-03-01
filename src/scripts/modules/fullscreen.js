/* REFERENCE:
 * Light wrapper around Fullscreen API
 *
 * Tried to use `screenfull`, but it fails to work for non-embedded video players.
 *
 * For some reason, webkit browsers require a prefix on `fullscreenchange` event,
 * in order to work with direct video players, the ones outside of `iframe`.
 *
 * Aside, `screenfull` is complete API wrapper made to work with older browser versions,
 * and as this is an extension, I expect the user to always have the latest browser
 * and I won't worry about this.
 */

class Fullscreen {
  constructor () {
    this.event = 'fullscreenchange'
    this.prefixes = ['', 'webkit']
  }

  get isAllowed () {
    return Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled)
  }

  get isActive () {
    return Boolean(this.element)
  }

  get element () {
    return (document.fullscreenElement || document.webkitFullscreenElement)
  }

  on (callback) {
    this.prefixes.forEach(prefix => {
      document.addEventListener(prefix + this.event, callback, false)
    })
  }

  off (callback) {
    this.prefixes.forEach(prefix => {
      document.removeEventListener(prefix + this.event, callback, false)
    })
  }
}

export default Fullscreen
