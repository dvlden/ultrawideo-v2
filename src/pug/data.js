const categories = [{
  title: 'Master',
  tooltip: 'While pause is active, extension shortcuts will not respond.'
}, {
  title: 'Modes',
  tooltip: 'Only one mode can be active at a time. Combining is not possible.'
}, {
  title: 'Shortcuts',
  tooltip: 'You may configure your own keystrokes. Press and hold three desired keys.'
}]

const options = [
  {
    name: 'Pause',
    id: 'master',
    category: 'master'
  },
  {
    name: 'Normal',
    id: 'normal',
    category: 'modes'
  },
  {
    name: 'Upscale',
    id: 'upscale',
    category: 'modes'
  },
  {
    name: 'Stretch',
    id: 'stretch',
    category: 'modes'
  },
  {
    name: 'Toggle Pause',
    id: 'toggle_pause',
    placeholder: '0+meta+shift',
    category: 'shortcuts'
  },
  {
    name: 'Toggle Modes',
    id: 'toggle_mode',
    placeholder: '9+meta+shift',
    category: 'shortcuts'
  }
]

const browsers = [
  {
    name: 'Chrome',
    icon: require('../images/brand-icons/chrome.svg').default,
    link: 'https://chrome.google.com/webstore/detail/ultrawideo/bfbnagnphiehemkdgmmficmjfddgfhpl'
  },
  {
    name: 'Firefox',
    icon: require('../images/brand-icons/firefox.svg').default,
    link: 'https://addons.mozilla.org/en-US/firefox/addon/ultrawideo/'
  },
  {
    name: 'Edge',
    icon: require('../images/brand-icons/edge.svg').default,
    link: 'https://microsoftedge.microsoft.com/addons/detail/ultrawideo/nljggnfdanlckapcflfnhnckjbonppjh'
  }
]

const copyrightYear = () => {
  let current = new Date().getFullYear()
  let shortFormat = Number(current.toString().slice(2))

  return shortFormat === 18 ? new Date().getFullYear() : `18/${current}`
}

module.exports = {
  categories,
  options,
  browsers,
  copyrightYear
}
