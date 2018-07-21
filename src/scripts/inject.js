import classes from './store/classes'
import Storage from './helpers/Storage'
import FullScreen from './helpers/fullscreen/fullscreen'

class Inject {
  constructor () {
    this.bodyEl = document.body
    this.settings = {}
    this.storage = new Storage
    this.fullscreen = new FullScreen

    this.getSettingsFromStorage()
    this.listenForStorageChanges()
    this.setFullScreenEvent()
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
      if ('master' in changes) {
        this.settings.master = changes.master.newValue

        if (changes.master.newValue === true) {
          this.fullscreen.destroyEvent()
        }
        else {
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
      let videoEl = document.querySelector('video')
      videoEl ? resolve(videoEl) : reject()
    })
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
