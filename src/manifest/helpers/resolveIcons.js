const fs = require('fs')

module.exports = (() => {
  let store = { default: {}, disabled: {} }

  fs.readdirSync('src/icons').forEach(icon => {
    let splitName = icon.split('-')
    return store[splitName[0]][splitName[1].replace('.png', '')] = `icons/${icon}`
  })

  return store
})()
