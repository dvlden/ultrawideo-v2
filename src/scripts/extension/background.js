import browser from 'webextension-polyfill'
import Storage from '@/helpers/storage'
import Icon from '@/modules/icon'
import * as defaults from '@/static/defaults'

class Background extends Storage {
  constructor () {
    super()

    this.icon = new Icon
  }

  registerInstallEvent () {
    browser.runtime.onInstalled.addListener(async details => {
      if (details.reason === 'install') {
        this.set(defaults.settings)

        browser.tabs.create({
          url: browser.runtime.getURL('welcome.html')
        })
      }

      if (details.reason === 'update') {
        await this.syncData()
        this.icon.toggleCurrent(this.data.pause)
      }
    })
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

  async onMessageRequest (message) {
    const keystroke = this.checkKeystrokeValidity(message)

    if (!keystroke) return false

    if (keystroke === 'toggle_pause') {
      this.set({ pause: !this.data.pause })
    }

    if (keystroke === 'toggle_mode') {
      this.set({ mode: defaults.modesKeys[this.modeId] })
    }

    return true
  }

  get currentModeId () {
    return defaults.modesKeys.indexOf(this.data.mode)
  }

  get modesLength () {
    return defaults.modesKeys.length - 1
  }

  get modeId () {
    let index = this.currentModeId

    return (index >= this.modesLength)
      ? 0
      : index + 1
  }

  checkKeystrokeValidity (message) {
    return defaults.settingsKeys
      .filter(key => key.includes('toggle'))
      .find(key => this.data[key] === message)
  }
}

export default Background
