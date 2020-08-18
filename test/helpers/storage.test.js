import Storage from '@/helpers/storage'
import browser from 'sinon-chrome/webextensions'
import * as defaults from '@/static/defaults'

jest.mock('webextension-polyfill', () => require('sinon-chrome/webextensions'))

describe('tests for storage helper', () => {
  beforeAll(() => {
    global.instance = new Storage('local')
    instance.storage = browser.storage.local
    browser.storage.local.get.resolves(defaults.settings)
  })

  afterAll(() => {
    delete global.instance
    browser.flush()
  })

  it('should be valid instance', () => {
    expect(instance).toBeInstanceOf(Storage)
  })

  describe('test set method', () => {
    it('should be able to set data to storage', () => {
      instance.set(defaults.settings)

      expect(browser.storage.local.set.called).toBe(true)
    })
  })

  describe('test onChange method', () => {
    it('should trigger an event if any changes occur to storage', () => {
      const mockCallback = jest.fn()

      instance.onChange(mockCallback)

      browser.storage.onChanged.trigger()

      expect(mockCallback).toBeCalled()
    })
  })

  describe('test syncData method', () => {
    it('should sync storage data to cache', async () => {
      await instance.syncData()

      expect(instance.data).toMatchObject(defaults.settings)
    })
  })
})
