import classes from './store/classes'
import Storage from './helpers/Storage'
import FullScreen from './helpers/fullscreen/fullscreen'

class Inject {
  constructor () {
    this.bodyEl = document.body
    this.settings = {}
    this.storage = new Storage()
    this.fullscreen = new FullScreen()

    this.setFullScreenEvent()
    this.getSettingsFromStorage()
    this.listenForStorageChanges()
  }

  getSettingsFromStorage () {
    this.storage.get(['master', 'mode'])
      .then(settings => this.settings = settings)
      .then(() => {
        if (!this.settings.master) {
          this.fullscreen.listenEvent()
        }
      })
  }

  listenForStorageChanges () {
    this.storage.listener(changes => {
      this.inFullScreen(changes)

      if ('master' in changes) {
        this.settings.master = changes.master.newValue

        if (changes.master.newValue) {
          this.fullscreen.destroyEvent()
        }

        if (changes.master.oldValue) {
          this.fullscreen.listenEvent()
        }
      }

      if ('mode' in changes) {
        this.settings.mode = changes.mode.newValue
      }
    })
  }

  checkForVideoElement () {
    return new Promise((resolve, reject) => {
      let videoEl = document.querySelector('video:not([title])')
      videoEl ? resolve(videoEl) : reject()
    })
  }

  inFullScreen (settings) {
    if (!document[this.fullscreen.api.el]) return

    if ('master' in settings) {
      this.bodyEl.classList[
        !settings.master.newValue
          ? 'add'
          : 'remove'
      ](classes.body)
    }

    if ('mode' in settings) {
      this.checkForVideoElement().then(videoEl => {
        videoEl.classList.remove(classes.modes[settings.mode.oldValue])
        videoEl.classList.add(classes.modes[settings.mode.newValue])
      })
    }
  }

  setFullScreenEvent () {
    this.fullscreen.onChange(element => {
      this.checkForVideoElement().then(videoEl => {
        let toggleClassMethod = document[element] ? 'add' : 'remove'

        this.bodyEl.classList[toggleClassMethod](
          classes.body
        )

        videoEl.classList[toggleClassMethod](
          classes.video,
          classes.modes[this.settings.mode]
        )
      })
    })
  }
}

new Inject
