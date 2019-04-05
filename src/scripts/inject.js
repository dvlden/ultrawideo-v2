import Storage from '@/helpers/Storage'
import Inject from './extension/inject'

const instance = new Inject

instance.syncData().then(data => {
  instance.registerStorageEvent()

  if (!data.pause) {
    instance.registerFullscreenEvent()
    instance.registerShortcutEvent()
  }
})
