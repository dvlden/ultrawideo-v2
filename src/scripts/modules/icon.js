import browser from 'webextension-polyfill'

class Icon {
  constructor () {
    this.icons = this.resolveIcons()
  }

  set current (object) {
    browser.browserAction.setIcon({
      path: object
    })
  }

  get default () {
    return this.icons.default
  }

  get disabled () {
    return this.icons.disabled
  }

  toggleCurrent (prop) {
    this.current = prop
      ? this.disabled
      : this.default
  }

  resolveIcons () {
    let store = { default: {}, disabled: {} }

    Object.entries(browser.runtime.getManifest().icons).map(([size, path]) => {
      store.default[size] = path
      store.disabled[size] = path.replace('default', 'disabled')
    })

    return store
  }
}

export default Icon
