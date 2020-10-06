const settings = {
  pause: false,
  mode: 'upscale',
  toggle_pause: '0+Meta+Shift',
  toggle_mode: '9+Meta+Shift'
}

const classes = {
  body: 'uwv-active',
  video: 'uwv-video',
  modes: {
    normal: 'uwv-normal',
    upscale: 'uwv-upscale',
    stretch: 'uwv-stretch'
  }
}

const settingsKeys = Object.keys(settings)
const modesKeys = Object.keys(classes.modes)

export {
  settings,
  classes,
  settingsKeys,
  modesKeys
}
