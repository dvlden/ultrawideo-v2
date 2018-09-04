import Storage from './helpers/Storage'

class Settings {
  constructor (elements) {
    this.elements = elements
    this.storage = new Storage
    this.onToggleCallback = this.onToggleChange.bind(this)

    this.storage.get(['master', 'mode']).then(settings => {
      this.syncWithElements(settings)
    })

    this.listenForEvents()

    if (window.navigator.platform.toLowerCase().includes('mac')) {
      Array.from(document.querySelectorAll('.os-detect')).forEach(el => {
        el.textContent = 'cmd'
      })
    }
  }

  syncWithElements (settings) {
    Array.from(this.elements).forEach(element => {
      if (element.dataset.key === 'master' && settings.hasOwnProperty('master')) {
        element.checked = settings.master
      }

      if (element.dataset.key !== 'master' && settings.hasOwnProperty('mode')) {
        element.checked = (element.dataset.key === settings.mode)
      }
    })
  }

  preventModeFromBeingDisabled (current) {
    let currentKey = current.dataset.key

    Array.from(this.elements).forEach(element => {
      let elementKey = element.dataset.key

      if (currentKey === 'master' || elementKey === 'master') return

      element.checked = false

      if (currentKey === elementKey) {
        element.checked = true
      }
    })
  }

  onToggleChange ({ target }) {
    let current = {
      el: target,
      state: target.checked,
      key: target.dataset.key
    }

    this.preventModeFromBeingDisabled(current.el)

    if (current.key === 'master') {
      this.storage.set({ master: current.state })
    }
    else {
      this.storage.set({ mode: current.key })
    }
  }

  listenForEvents () {
    document.addEventListener('change', this.onToggleCallback, false)

    this.storage.listener(changes => {
      if ('master' in changes) {
        this.syncWithElements({ master: changes.master.newValue })
      }

      if ('mode' in changes) {
        this.syncWithElements({ mode: changes.mode.newValue })
      }
    })
  }
}

new Settings(
  document.querySelectorAll('.switch > input')
)
