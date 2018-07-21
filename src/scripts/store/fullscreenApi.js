const unprefixed = {
  el: 'fullscreenElement',
  state: 'fullscreenEnabled',
  event: 'fullscreenchange'
}

const prefixed = {
  webkit: {
    el: 'webkitFullscreenElement',
    state: 'webkitFullscreenEnabled',
    event: 'webkitfullscreenchange'
  },
  moz: {
    el: 'mozFullScreenElement',
    state: 'mozFullScreenEnabled',
    event: 'mozfullscreenchange'
  }
}

export {
  unprefixed,
  prefixed
}
