import Popup from './extension/popup'

const instance = new Popup

instance.syncData().then(() => {
  instance.syncElementsWithStorage()
  instance.registerChangeEvent()
  instance.handleShortcutElementsInteractivity()
})
