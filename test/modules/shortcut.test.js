import Shortcut from '@/modules/shortcut'

describe('tests for shortcut module', () => {
  beforeAll(() => {
    global.instance = new Shortcut(document, 3)
  })

  afterAll(() => {
    delete global.instance
  })

  it('should be valid instance', () => {
    expect(instance).toBeInstanceOf(Shortcut)
  })

  it('should have default element and limit if not passed as arguments', () => {
    const customInstance = new Shortcut

    expect(customInstance.element).toBe(document)
    expect(customInstance.limit).toBe(3)
  })

  it('should be possible to pass an element and limit to the instance', () => {
    const mockInstance = jest.fn((element, limit) => new Shortcut(element, limit))

    mockInstance(document.body, 4)

    expect(mockInstance).toHaveBeenCalledWith(document.body, 4)
  })

  describe('test onKeyPress method', () => {
    afterEach(() => {
      instance.keys = []
      instance.lastKey = null
      jest.restoreAllMocks()
    })

    it('should not execute if event is prevented', () => {
      jest.spyOn(instance, 'onKeyPress')

      document.addEventListener('keydown', (e) => {
        e.preventDefault()
        instance.onKeyPress(e)
      })

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: '0', cancelable: true })
      )

      expect(instance.onKeyPress).toHaveReturnedWith(undefined)
      expect(instance.keys).toHaveLength(0)
      expect(instance.lastKey).toBe(null)
    })

    it('should add a key from event to the keys array', () => {
      instance.onKeyPress(
        new KeyboardEvent('keydown', { key: '3' })
      )

      expect(instance.keys).toEqual(['3'])
    })

    it('should sort the array of keys', () => {
      instance.keys = ['Shift', 'Alt']

      instance.onKeyPress(
        new KeyboardEvent('keydown', { key: '3' })
      )

      expect(instance.keys).toEqual(['3', 'Alt', 'Shift'])
    })

    it('should set the lastKey to equal the last key pressed after fulfillment', () => {
      instance.keys = ['Control', 'Shift']
      instance.lastKey = null

      instance.onKeyPress(
        new KeyboardEvent('keydown', { key: '3' })
      )

      expect(instance.lastKey).toBe('3')
    })

    it('should emit the fulfilled event and return combined keystroke', () => {
      jest.spyOn(instance, 'emit')

      instance.keys = ['0', 'Control']

      instance.onKeyPress(
        new KeyboardEvent('keydown', { key: 'Shift' })
      )

      expect(instance.emit.mock.calls[0]).toContain('0+Control+Shift')
    })
  })

  describe('test onKeyRelease method', () => {
    it('should restore keystrokes to initial empty state', () => {
      instance.keys = ['0', 'Control', 'Shift']
      instance.lastKey = '0'

      instance.onKeyRelease(
        new KeyboardEvent('keyup', { key: 'Control' })
      )

      instance.onKeyRelease(
        new KeyboardEvent('keyup', { key: 'Shift' })
      )

      instance.onKeyRelease(
        new KeyboardEvent('keyup', { key: '0' })
      )

      expect(instance.keys).toHaveLength(0)
      expect(instance.lastKey).toBe(null)
    })
  })

  describe('test startRecording method', () => {
    beforeEach(() => {
      jest.spyOn(instance, 'onKeyDown')
      jest.spyOn(instance, 'onKeyUp')
      instance.startRecording()
    })

    afterEach(() => {
      jest.restoreAllMocks()
      instance.stopRecording()
    })

    it('should trigger onKeyDown when event is emitted', () => {
      instance.element.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a' })
      )

      expect(instance.onKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should trigger onKeyUp when event is emitted', () => {
      instance.element.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'a' })
      )

      expect(instance.onKeyUp).toHaveBeenCalledTimes(1)
    })
  })

  describe('test stopRecording method', () => {
    beforeEach(() => {
      jest.spyOn(instance, 'onKeyDown')
      jest.spyOn(instance, 'onKeyUp')
      instance.startRecording()
      instance.stopRecording()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should not trigger onKeyDown when event is emitted', () => {
      instance.element.dispatchEvent(
        new KeyboardEvent('keydown')
      )

      expect(instance.onKeyDown).not.toHaveBeenCalled()
    })

    it('should trigger onKeyUp when event is emitted', () => {
      instance.element.dispatchEvent(
        new KeyboardEvent('keyup')
      )

      expect(instance.onKeyUp).not.toHaveBeenCalled()
    })
  })
})
