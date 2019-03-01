import browser from 'sinon-chrome/webextensions'
import manifest from '../../src/manifest/index'
import resolveIcons from '../../src/manifest/helpers/resolveIcons'
import Icon from '@/modules/icon'

jest.mock('webextension-polyfill', () => require('sinon-chrome/webextensions'))

describe('tests for icon module', () => {
  beforeAll(() => {
    browser.runtime.getManifest.returns(manifest)
    global.instance = new Icon
  })

  afterAll(() => {
    browser.flush()
    delete global.instance
  })

  it('should set given object of icons', () => {
    const icons = {
      '16': 'icon-16.png',
      '32': 'icon-32.png'
    }

    instance.current = icons

    expect(browser.browserAction.setIcon.calledWith({ path: icons })).toBe(true)
  })

  it('should return default icons', () => {
    expect(instance.default).toMatchObject(resolveIcons.default)
  })

  it('should return disabled icons', () => {
    expect(instance.disabled).toMatchObject(resolveIcons.disabled)
  })

  it('should toggle current icon between disabled and default', () => {
    instance.toggleCurrent(true)

    expect(browser.browserAction.setIcon.calledWith({ path: instance.disabled })).toBe(true)

    instance.toggleCurrent(false)

    expect(browser.browserAction.setIcon.calledWith({ path: instance.default })).toBe(true)
  })

  it('should return object of default and disabled icons', () => {
    expect(instance.resolveIcons()).toMatchObject(resolveIcons)
  })
})
