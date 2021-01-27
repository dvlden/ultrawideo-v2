import EventEmitter from 'eventemitter3'

class Shortcut extends EventEmitter {
  constructor (element = document, keystrokeLimit = 3) {
    super()

    this.element = element
    this.lastKey = null
    this.keys = []
    this.limit = keystrokeLimit

    this.onKeyDown = this.onKeyPress.bind(this)
    this.onKeyUp = this.onKeyRelease.bind(this)
  }

  onKeyPress (e) {
    /*
      Developer Note:
      META key is problematic (at least on macOS)
      While being held down with or without other modifier keys, it wont register a key-release of any key

      Example...
      Combo: Meta + Shift + K
      Let go of: K
      Key release (keyup), won't register K as released, not even when you let go the modifier keys
    */

    if (e.defaultPrevented || e.repeat || e.metaKey) return

    if (!this.keys.includes(e.key)) {
      this.keys.push(e.key)
    }

    this.keys.sort()

    if (this.keys.length === this.limit) {
      this.lastKey = e.key
      this.emit('fulfilled', this.keys.join('+'))
    }
  }

  onKeyRelease (e) {
    this.keys.splice(this.keys.indexOf(e.key), 1)

    if (this.lastKey === e.key) {
      this.lastKey = null
    }
  }

  startRecording () {
    this.element.addEventListener('keydown', this.onKeyDown, true)
    this.element.addEventListener('keyup', this.onKeyUp, true)
  }

  stopRecording () {
    this.keys = []
    this.lastKey = null

    this.element.removeEventListener('keydown', this.onKeyDown, true)
    this.element.removeEventListener('keyup', this.onKeyUp, true)
  }
}

export default Shortcut
