const settings = {
  pause: false,
  mode: 'upscale',
  toggle_pause: 'Control+Shift+X',
  toggle_mode: 'Control+Shift+Z'
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
