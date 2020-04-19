import hasBlob from '@/helpers/hasBlob'

describe('test hasBlob helper', () => {
  beforeAll(() => {
    global.videoElement = document.createElement('video')
  })

  afterEach(() => {
    videoElement.src = ''
  })

  it('should return true if blob is present in video source', () => {
    videoElement.src = 'blob:https://video.source'
    expect(hasBlob(videoElement)).toBe(true)
  })

  it('should return false if blob is not present in video source', () => {
    videoElement.src = 'https://video.source'
    expect(hasBlob(videoElement)).toBe(false)
  })
})
