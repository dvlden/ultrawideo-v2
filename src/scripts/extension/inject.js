import browser from 'webextension-polyfill'
import Storage from '@/helpers/Storage'
import observe from '@/helpers/observe'
import { classes } from '@/static/defaults'
import Shortcut from '@/modules/shortcut'
import FullscreenVideo from '@/modules/fullscreen-video'

class Inject extends Storage {
  constructor () {
    super()

    this.fullscreen = new FullscreenVideo
    this.shortcut = new Shortcut

    this.whenFullscreenTriggers = this.whenFullscreenTriggers.bind(this)
    this.observer = new MutationObserver(observe(this))
  }

  registerStorageEvent () {
    // !! DO NOT cache method on the listener, it's never canceled
    this.onChange(this.onStorageChange.bind(this))
  }

  onStorageChange (changes) {
    this.syncData()
    this.toggleDOMChangesWhileInFullscreen(changes)

    if (changes.hasOwnProperty('pause')) {
      if (changes.pause.newValue) {
        this.cancelFullscreenEvent()
        this.cancelShortcutEvent()
      }
      else {
        this.registerFullscreenEvent()
        this.registerShortcutEvent()
      }
    }
  }

  whenFullscreenTriggers () {
    if (this.fullscreen.isActive) {
      this.fullscreen.cachedElement = this.fullscreen.videoElement
      this.registerObserver()

      // console.log({
      //   el: this.fullscreen.element,
      //   vEl: this.fullscreen.videoElement,
      //   cEl: this.fullscreen.cachedElement
      // })
    } else {
      this.cancelObserver()
    }

    this.toggleDOMChanges()
  }

  toggleDOMChangesWhileInFullscreen (changes) {
    if (!this.fullscreen.isActive) return

    if (changes.hasOwnProperty('pause')) {
      if (document.body.classList.contains(classes.body)) {
        document.body.classList.remove(classes.body)
      }

      if (this.fullscreen.cachedElement) {
        this.fullscreen.cachedElement.classList.remove(
          classes.video,
          classes.modes[this.data.mode]
        )
      }
    }

    if (changes.hasOwnProperty('mode') && this.fullscreen.cachedElement) {
      this.fullscreen.cachedElement.classList.replace(
        classes.modes[changes.mode.oldValue],
        classes.modes[changes.mode.newValue]
      )
    }
  }

  toggleDOMChanges (ignoreBody = false) {
    if (!this.fullscreen.cachedElement) return

    if (!ignoreBody) {
      document.body.classList.toggle(classes.body)
    }

    this.fullscreen.cachedElement.classList.toggle(classes.video)
    this.fullscreen.cachedElement.classList.toggle(classes.modes[this.data.mode])
  }

  registerFullscreenEvent () {
    this.fullscreen.on(this.whenFullscreenTriggers)
  }

  cancelFullscreenEvent () {
    this.fullscreen.off(this.whenFullscreenTriggers)
  }

  registerObserver () {
    this.observer.observe(this.fullscreen.element, { childList: true, subtree: false })
    // subtree must be disabled for: Netflix
    // subtree must be enabled for: Disney+, HBO, Udemy
    // no observer needed for: everything that wasn't mentioned
    // there is target prop in observer, but it can't seem to be used to find video selector :/
  }

  cancelObserver () {
    this.observer.disconnect()
  }

  registerShortcutEvent () {
    this.shortcut.startRecording()
    this.shortcut.on('fulfilled', browser.runtime.sendMessage)
  }

  cancelShortcutEvent () {
    this.shortcut.stopRecording()
    this.shortcut.off('fulfilled', browser.runtime.sendMessage)
  }
}

export default Inject
