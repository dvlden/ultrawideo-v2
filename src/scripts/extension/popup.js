import browser from 'webextension-polyfill'
import Storage from '@/helpers/Storage'
import Shortcut from '@/modules/shortcut'

class Popup extends Storage {
  constructor () {
    super()

    this.elements = document.querySelectorAll('input')
    this.shortcutElements = this.filterShortcutElements()
  }

  filterShortcutElements () {
    return Array.from(this.elements).filter(
      element => element.id.includes('toggle')
    )
  }

  async syncElementsWithStorage () {
    this.elements.forEach(element => {
      switch (element.dataset.category) {
        case 'master':
          element.checked = this.data.pause
          break

        case 'modes':
          element.checked = (element.id === this.data.mode)
          break

        case 'shortcuts':
          element.value = this.data[element.id]
          break
      }
    })
  }

  registerChangeEvent () {
    document.addEventListener('change', this.updateStorage.bind(this), false)
  }

  handleShortcutElementsInteractivity () {
    this.shortcutElements.forEach(element => {
      const shortcut = new Shortcut(element)
      const event = new Event('change', {
        bubbles: true
      })

      element.addEventListener('focus', () => {
        shortcut.startRecording()
        element.value = ''
      })

      shortcut.on('fulfilled', keystroke => {
        this.set({ [element.id]: keystroke })
        shortcut.stopRecording()

        element.value = keystroke
        element.blur()
        element.dispatchEvent(event)
      })
    })
  }

  updateStorage ({ target: element }) {
    switch (element.dataset.category) {
      case 'master':
        this.set({ pause: element.checked })
        break

      case 'modes':
        this.set({ mode: element.id })
        break

      case 'shortcuts':
        this.set({ [element.id]: element.value })
        break
    }
  }
}

export default Popup
