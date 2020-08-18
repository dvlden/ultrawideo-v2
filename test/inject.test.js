import browser from 'sinon-chrome/webextensions'
import Inject from '@/extension/inject'
import FullscreenVideo from '@/modules/fullscreen-video'
import Shortcut from '@/modules/shortcut'
import * as defaults from '@/static/defaults'

jest.mock('webextension-polyfill', () => require('sinon-chrome/webextensions'))

describe('test the inject', () => {
  beforeAll(() => {
    global.instance = new Inject
    instance.data = defaults.settings
    instance.storage = browser.storage.local
    browser.storage.local.get.resolves(defaults.settings)
  })

  afterAll(() => {
    browser.flush()
    delete global.instance
  })

  beforeEach(() => {
    global.changes = {}
  })

  afterEach(() => {
    delete global.changes
  })

  it('should be valid instance', () => {
    expect(instance).toBeInstanceOf(Inject)
  })

  describe('test registerStorageEvent method', () => {
    it('should register storage onChange event', () => {
      instance.registerStorageEvent()

      expect(browser.storage.onChanged.addListener.calledOnce).toBe(true)
    })
  })

  describe('test onStorageChange method', () => {
    it('should call syncData', () => {
      const spy = jest.spyOn(instance, 'syncData')

      instance.onStorageChange(changes)

      expect(instance.syncData).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should call toggleDOMChangesWhileInFullscreen method', () => {
      const spy = jest.spyOn(instance, 'toggleDOMChangesWhileInFullscreen')

      changes = {}

      instance.onStorageChange(changes)

      expect(instance.toggleDOMChangesWhileInFullscreen).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should call methods to cancel registered events if pause exists and is true', () => {
      const spy = {
        cancelFullscreenEvent: jest.spyOn(instance, 'cancelFullscreenEvent'),
        cancelShortcutEvent: jest.spyOn(instance, 'cancelShortcutEvent')
      }

      changes = {
        pause: {
          newValue: true,
          oldValue: false
        }
      }

      instance.onStorageChange(changes)

      expect(instance.cancelFullscreenEvent).toHaveBeenCalled()
      expect(instance.cancelShortcutEvent).toHaveBeenCalled()

      spy.cancelFullscreenEvent.mockRestore()
      spy.cancelShortcutEvent.mockRestore()
    })

    it('should call methods to register previously cancelled events if pause exists and is false', () => {
      const spy = {
        registerFullscreenEvent: jest.spyOn(instance, 'registerFullscreenEvent'),
        registerShortcutEvent: jest.spyOn(instance, 'registerShortcutEvent')
      }

      changes = {
        pause: {
          newValue: false,
          oldValue: true
        }
      }

      instance.onStorageChange(changes)

      expect(instance.registerFullscreenEvent).toHaveBeenCalled()
      expect(instance.registerShortcutEvent).toHaveBeenCalled()

      spy.registerFullscreenEvent.mockRestore()
      spy.registerShortcutEvent.mockRestore()
    })
  })

  describe('test whenFullscreenTriggers method', () => {
    it('should cache fullscreen element if fullscreen state is active', () => {
      let element = document.createElement('video')

      document.fullscreenElement = element

      instance.whenFullscreenTriggers()

      expect(instance.fullscreen.isActive).toBe(true)
      expect(instance.fullscreen.cachedElement).toEqual(element)

      element = null
      document.fullscreenElement = undefined
    })

    it('should trigger toggleDOMChanges method', () => {
      const spy = jest.spyOn(instance, 'toggleDOMChanges')

      instance.whenFullscreenTriggers()

      expect(instance.toggleDOMChanges).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })
  })

  describe('test toggleDOMChangesWhileInFullscreen method', () => {
    beforeEach(() => {
      global.element = document.createElement('video')
      document.fullscreenElement = element
      instance.fullscreen.cachedElement = null
      jest.spyOn(instance, 'toggleDOMChangesWhileInFullscreen')
    })

    afterEach(() => {
      delete global.element
      document.fullscreenElement = undefined
      jest.restoreAllMocks()
    })

    it('should not execute unless fullscreen is in active state', () => {
      document.fullscreenElement = undefined

      instance.toggleDOMChangesWhileInFullscreen(changes)

      expect(instance.fullscreen.isActive).toBe(false)
      expect(instance.toggleDOMChangesWhileInFullscreen).toReturnWith(undefined)
    })

    it('should remove extension class from the body', () => {
      changes = {
        pause: {}
      }

      document.body.classList.add(defaults.classes.body)
      instance.toggleDOMChangesWhileInFullscreen(changes)

      expect(document.body.classList.contains(defaults.classes.body)).toBe(false)
    })

    it('should remove extension classes from the cached element', () => {
      instance.fullscreen.cachedElement = element

      changes = {
        pause: {}
      }

      instance.fullscreen.cachedElement.classList.add(
        defaults.classes.video,
        defaults.classes.modes[instance.data.mode]
      )
      instance.toggleDOMChangesWhileInFullscreen(changes)

      expect(instance.fullscreen.cachedElement.classList.contains(defaults.classes.video)).toBe(false)
      expect(instance.fullscreen.cachedElement.classList.contains(defaults.classes.modes[instance.data.mode])).toBe(false)
    })

    it('should replace current mode class with new mode class if mode is present in changes and cachedElement exists', () => {
      instance.fullscreen.cachedElement = element

      changes = {
        mode: {
          newValue: 'stretch',
          oldValue: 'upscale'
        }
      }

      instance.fullscreen.cachedElement.classList.add(defaults.classes.video, defaults.classes.modes[instance.data.mode])

      instance.toggleDOMChangesWhileInFullscreen(changes)

      expect(instance.fullscreen.cachedElement.classList.contains('uwv-upscale')).toBe(false)
      expect(instance.fullscreen.cachedElement.classList.contains('uwv-stretch')).toBe(true)
    })
  })

  describe('test toggleDOMChanges method', () => {
    beforeEach(() => {
      global.element = document.createElement('video')
      instance.fullscreen.cachedElement = null
    })

    afterEach(() => {
      delete global.element
    })

    it('should stop execution if there is no fullscreen.cachedElement', () => {
      const spy = jest.spyOn(instance, 'toggleDOMChanges')

      instance.toggleDOMChanges()

      expect(instance.toggleDOMChanges).toReturnWith(undefined)

      spy.mockRestore()
    })

    it('should toggle extension classes to the body and cachedElement', () => {
      instance.fullscreen.cachedElement = element

      instance.toggleDOMChanges()

      expect(document.body.classList.contains(defaults.classes.body)).toBe(true)
      expect(instance.fullscreen.cachedElement.classList.contains(defaults.classes.video)).toBe(true)
      expect(instance.fullscreen.cachedElement.classList.contains(defaults.classes.modes[instance.data.mode])).toBe(true)

      document.body.classList.remove(defaults.classes.body)
    })

    it('should ignore toggling the body class', () => {
      instance.fullscreen.cachedElement = element

      instance.toggleDOMChanges(true)

      expect(document.body.classList.contains(defaults.classes.body)).toBe(false)
    })
  })
})
