const pkg = require('../../package.json')
const capitalizeName = require('./helpers/capitalizeName')
const icons = require('./helpers/resolveIcons')

module.exports = {
  name: capitalizeName(pkg.name),
  description: pkg.description,
  version: pkg.version,
  author: pkg.author.name,
  homepage_url: pkg.repository.url,
  manifest_version: 2,
  icons: icons.default,
  browser_action: {
    default_title: capitalizeName(pkg.name),
    default_popup: 'popup.html',
    default_icon: icons.default
  },
  background: {
    persistent: false,
    scripts: ['scripts/background.js']
  },
  content_scripts: [{
    matches: ['*://*/*'],
    all_frames: true,
    js: ['scripts/inject.js'],
    css: ['styles/inject.css']
  }],
  permissions: [
    'storage'
  ]
}
