import browser from 'webextension-polyfill'
import Storage from '@/helpers/storage'
import { classes } from '@/static/defaults'
import Shortcut from '@/modules/shortcut'
import FullscreenVideo from '@/modules/fullscreen-video'

class Inject extends Storage {
  constructor () {
    super()

    this.fullscreen = new FullscreenVideo
    this.shortcut = new Shortcut

    this.whenFullscreenTriggers = this.whenFullscreenTriggers.bind(this)
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

  toggleDOMChanges () {
    if (!this.fullscreen.cachedElement) return

    document.body.classList.toggle(classes.body)
    this.fullscreen.cachedElement.classList.toggle(classes.video)
    this.fullscreen.cachedElement.classList.toggle(classes.modes[this.data.mode])
  }

  registerFullscreenEvent () {
    this.fullscreen.on(this.whenFullscreenTriggers)
  }

  cancelFullscreenEvent () {
    this.fullscreen.off(this.whenFullscreenTriggers)
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
