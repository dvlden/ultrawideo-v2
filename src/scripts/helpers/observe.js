const observe = instance => records => {
  records.forEach(record => {
    record.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return

      const videoElement = node.querySelector('video')

      if (videoElement) {
        instance.fullscreen.cachedElement = videoElement
        instance.toggleDOMChanges(true)
      }
    })
  })
}

export default observe
