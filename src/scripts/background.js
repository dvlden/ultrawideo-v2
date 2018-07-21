import Storage from './helpers/Storage'

const api = (chrome || browser)
let storage = new Storage

api.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
    master: false,
    mode: 'upscale'
  }

  storage.set(defaultSettings)
})

api.browserAction.setBadgeBackgroundColor({
  color: '#5f13b7'
})

storage.listener(changes => {
  if ('master' in changes) {
    api.browserAction.setBadgeText({
      text: changes.master.newValue ? 'Ⅱ' : ''
    })
  }
})
