import * as defaults from '@/static/defaults'

describe('check if all defaults are defined', () => {
  it('must contain settings', () => {
    expect(defaults.settings).toBeDefined()
  })

  it('must contain classes', () => {
    expect(defaults.classes).toBeDefined()
  })

  it('must contain settingsKeys', () => {
    expect(defaults.settingsKeys).toBeDefined()
  })

  it('must contain modesKeys', () => {
    expect(defaults.modesKeys).toBeDefined()
  })
})
