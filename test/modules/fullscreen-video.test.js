import FullscreenVideo from '@/modules/fullscreen-video'

const setHostname = url => {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: url
    }
  })
}

const platforms = {
  amazon: [
    'https://www.primevideo.com',
    'https://smile.amazon.de',
    'https://www.amazon.com'
  ],
  hulu: 'https://www.hulu.com'
}

describe('tests for fullscreen-video module', () => {
  beforeAll(() => {
    global.instance = new FullscreenVideo
    global.videoElement = document.createElement('video')
    global.videoElementTwo = document.createElement('video')
    global.videoElementThree = document.createElement('video')
    global.wrappedVideoElement = document.createElement('div')

    wrappedVideoElement.appendChild(videoElement)
    wrappedVideoElement.appendChild(videoElementTwo)
    wrappedVideoElement.appendChild(videoElementThree)
  })

  afterEach(() => {
    videoElement.src = ''
    videoElementTwo.src = ''
    videoElementThree.src = ''
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

    it('should return first video element if multiple are present', () => {
      document.fullscreenElement = wrappedVideoElement
      document.webkitFullscreenElement = wrappedVideoElement

      videoElement.src = '//video.source'
      videoElementTwo.src = '//video-2.source'
      videoElementThree.src = '//video-3.source'

      expect(instance.videoElement).toBe(videoElement)
    })

    it('should return a video element that has blob source (platform specific)', () => {
      document.fullscreenElement = wrappedVideoElement
      document.webkitFullscreenElement = wrappedVideoElement

      videoElement.src = '//video.source'
      videoElementTwo.src = 'blob://video-2.source'
      videoElementThree.src = '//video-3.source'

      setHostname(platforms.amazon[0])
      expect(instance.videoElement).toBe(videoElementTwo)

      setHostname(platforms.amazon[1])
      expect(instance.videoElement).toBe(videoElementTwo)

      setHostname(platforms.amazon[2])
      expect(instance.videoElement).toBe(videoElementTwo)

      setHostname(platforms.hulu)
      expect(instance.videoElement).toBe(videoElementTwo)
    })
  })
})
