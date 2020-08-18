import observe from '@/helpers/observe'

describe('test observe helper', () => {
  beforeAll(() => {
    global.mock = jest.fn((instance, nodes) => {
      observe(instance).call(null, [
        { addedNodes: [] },
        { addedNodes: [ nodes ] }
      ])
    })
  })

  beforeEach(() => {
    global.instance = {
      fullscreen: {
        cachedElement: undefined
      },
      toggleDOMChanges: jest.fn()
    }
  })

  afterEach(() => {
    delete global.instance
  })

  it('should not proceed with query for anything but Element nodes', () => {
    const node = document.createTextNode('...')

    mock(instance, node)

    expect(mock).toHaveBeenCalled()
  })

  it('should not run changes on the instance if video element is not defined', () => {
    const nodes = document.createElement('div')
    nodes.appendChild(document.createElement('span'))

    mock(instance, nodes)

    expect(mock).toHaveBeenCalled()
    expect(instance.fullscreen.cachedElement).toBe(undefined)
    expect(instance.toggleDOMChanges).not.toHaveBeenCalled()
  })

  it('should run changes on the instance if video element is defined', () => {
    const nodes = document.createElement('div')
    nodes.appendChild(document.createElement('video'))

    mock(instance, nodes)

    expect(mock).toHaveBeenCalled()
    expect(instance.fullscreen.cachedElement).toBe(nodes.querySelector('video'))
    expect(instance.toggleDOMChanges).toHaveBeenCalledWith(true)
  })
})
