import browser from 'webextension-polyfill'
import Storage from '@/helpers/Storage'
import Icon from '@/modules/icon'
import * as defaults from '@/static/defaults'

class Background extends Storage {
  constructor () {
    super()

    this.icon = new Icon
  }

  registerInstallEvent () {
    browser.runtime.onInstalled.addListener(async ({ reason }) => {
      if (reason === 'install') {
        browser.tabs.create({
          url: browser.runtime.getURL('welcome.html')
        })

        await this.overrideModeOnAndroidPlatform()
        this.set(defaults.settings)
      }

      if (reason === 'update') {
        await this.syncData()
        this.icon.toggleCurrent(this.data.pause)
      }
    })
  }

  async overrideModeOnAndroidPlatform () {
    const platform = await browser.runtime.getPlatformInfo()

    if (platform.os === 'android') {
      defaults.settings.mode = 'normal'
    }
  }

  registerStorageEvent () {
    this.onChange(this.onStorageChange.bind(this))
  }

  async onStorageChange (changes) {
    await this.syncData()

    if (changes.hasOwnProperty('pause')) {
      this.icon.toggleCurrent(changes.pause.newValue)
    }
  }

  registerMessageEvent () {
    browser.runtime.onMessage.addListener(this.onMessageRequest.bind(this))
  }

  onMessageRequest (message) {
    if (message === 'zoomin') {
      this.set({ mode: defaults.modesKeys[this.nextModeId] })
    } else if (message === 'zoomout') {
      this.set({ mode: defaults.modesKeys[this.previousModeId] })
    } else {
      const keystroke = this.checkKeystrokeValidity(message)

      if (!keystroke) return false

      if (keystroke === 'toggle_pause') {
        this.set({ pause: !this.data.pause })
      }

      if (keystroke === 'toggle_mode') {
        this.set({ mode: defaults.modesKeys[this.nextModeId] })
      }
    }

    return true
  }

  get currentModeId () {
    return defaults.modesKeys.indexOf(this.data.mode)
  }

  get modesLength () {
    return defaults.modesKeys.length - 1
  }

  get nextModeId () {
    let index = this.currentModeId

    return (index >= this.modesLength)
      ? 0
      : index + 1
  }

  get previousModeId () {
    let index = this.currentModeId

    return (index === 0)
      ? 0 // Do not go into stretch mode by zooming out from normal mode
      : index - 1
  }

  checkKeystrokeValidity(message) {
    return defaults.settingsKeys
      .filter(key => key.includes('toggle'))
      .find(key => this.data[key] === message)
  }
}

export default Background
