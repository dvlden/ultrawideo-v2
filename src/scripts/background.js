import browserApi from './helpers/browserApi'
import Storage from './helpers/Storage'

const api = browserApi.resolve()
const storage = new Storage

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

api.commands.onCommand.addListener(command => {
  storage.get(['master', 'mode']).then(settings => {
    switch (command) {
      case 'toggle-pause':
        storage.set({ 'master': !settings.master })
        break

      case 'toggle-mode':
        storage.set({ 'mode': (settings.mode === 'upscale') ? 'stretch' : 'upscale' })
        break
    }
  })
})
