import Fullscreen from '@/modules/fullscreen'

describe('tests for fullscreen module', () => {
  beforeAll(() => {
    global.instance = new Fullscreen
    global.videoElement = document.createElement('video')
  })

  afterAll(() => {
    delete global.instance
    delete global.videoElement

    document.fullscreenEnabled = undefined
    document.webkitFullscreenEnabled = undefined
    document.fullscreenElement = undefined
    document.webkitFullscreenElement = undefined
  })

  beforeEach(() => {
    global.mockCallback = jest.fn()
  })

  afterEach(() => {
    mockCallback.mockRestore()
  })

  describe('test isAllowed getter', () => {
    it('should return true if fullscreen is enabled', () => {
      document.fullscreenEnabled = true
      document.webkitFullscreenEnabled = true

      expect(instance.isAllowed).toBe(true)
    })

    it('should return false if fullscreen is disabled', () => {
      document.fullscreenEnabled = false
      document.webkitFullscreenEnabled = false

      expect(instance.isAllowed).toBe(false)
    })
  })

  describe('test isActive getter', () => {
    it('should return true if fullscreen is active', () => {
      document.fullscreenElement = videoElement
      document.webkitFullscreenElement = videoElement

      expect(instance.isActive).toBe(true)
    })

    it('should return false if fullscreen is inactive', () => {
      document.fullscreenElement = undefined
      document.webkitFullscreenElement = undefined

      expect(instance.isActive).toBe(false)
    })
  })

  describe('test element getter', () => {
    it('should return the fullscreen element', () => {
      document.fullscreenElement = videoElement
      document.webkitFullscreenElement = videoElement

      expect(instance.element).toBe(videoElement)
    })

    it('should return undefined if the fullscreen element does not exist', () => {
      document.fullscreenElement = undefined
      document.webkitFullscreenElement = undefined

      expect(instance.element).toBe(undefined)
    })
  })

  describe('test on method', () => {
    it('should trigger callback two times', () => {
      instance.on(mockCallback)

      document.dispatchEvent(new Event('fullscreenchange'), { bubbles: true })
      document.dispatchEvent(new Event('webkitfullscreenchange'), { bubbles: true })

      expect(mockCallback).toHaveBeenCalledTimes(2)
    })
  })

  describe('test off method', () => {
    it('should not trigger callback at all', () => {
      instance.on(mockCallback)
      instance.off(mockCallback)

      document.dispatchEvent(new Event('fullscreenchange'), { bubbles: true })
      document.dispatchEvent(new Event('webkitfullscreenchange'), { bubbles: true })

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })
})
