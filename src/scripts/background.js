import Background from './extension/background'

const instance = new Background

instance.registerInstallEvent()
instance.registerStorageEvent()
instance.registerMessageEvent()
