import Background from './extension/background'
import { settingsKeys } from '@/static/defaults'

const instance = new Background

instance.registerInstallEvent()
instance.registerStorageEvent()
instance.registerMessageEvent()
instance.syncData()
