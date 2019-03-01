import FullscreenVideo from '@/modules/fullscreen-video'

describe('tests for fullscreen-video module', () => {
  beforeAll(() => {
    global.instance = new FullscreenVideo
    global.videoElement = document.createElement('video')
    global.wrappedVideoElement = document.createElement('div')
    wrappedVideoElement.appendChild(videoElement)
  })

  afterAll(() => {
    delete global.instance
    delete global.videoElement
    delete global.wrappedVideoElement

    document.fullscreenElement = undefined
    document.webkitFullscreenElement = undefined
  })

  describe('test cachedElement setter and getter', () => {
    it('should cache the given element', () => {
      instance.cachedElement = videoElement

      expect(instance.cachedElement).toBe(videoElement)
    })
  })

  describe('test videoElement method', () => {
    it('should return video element if it is direct element', () => {
      document.fullscreenElement = videoElement
      document.webkitFullscreenElement = videoElement

      expect(instance.videoElement).toBe(videoElement)
    })

    it('should return video element if it is nested element', () => {
      document.fullscreenElement = wrappedVideoElement
      document.webkitFullscreenElement = wrappedVideoElement

      expect(instance.videoElement).toBe(videoElement)
    })
  })
})
