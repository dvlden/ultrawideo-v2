import FullscreenVideo from '@/modules/fullscreen-video'

describe('tests for fullscreen-video module', () => {
  beforeAll(() => {
    global.instance = new FullscreenVideo
    global.videoElement = document.createElement('video')
    global.videoElementTwo = document.createElement('video')
    global.wrappedVideoElement = document.createElement('div')

    wrappedVideoElement.appendChild(videoElement)
    wrappedVideoElement.appendChild(videoElementTwo)
  })

  afterEach(() => {
    videoElement.src = ''
    videoElementTwo.src = ''
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

      videoElement.src = '//video.source'

      expect(instance.videoElement).toBe(videoElement)
    })

    it('should return a blob video element', () => {
      document.fullscreenElement = wrappedVideoElement
      document.webkitFullscreenElement = wrappedVideoElement

      videoElement.src = '//video.source'
      videoElementTwo.src = 'blob://video-2.source'

      expect(instance.videoElement).toBe(videoElementTwo)
    })

    it('should return video element with any source', () => {
      document.fullscreenElement = wrappedVideoElement
      document.webkitFullscreenElement = wrappedVideoElement

      videoElement.src = '//video.source'
      videoElementTwo.src = '//video-2.source'

      expect(instance.videoElement).toBe(videoElement)
    })

    it('should not return anything if it fails to find a video element', () => {
      document.fullscreenElement = document.documentElement
      document.webkitFullscreenElement = document.documentElement

      expect(instance.videoElement).toBe(undefined)
    })
  })
})
