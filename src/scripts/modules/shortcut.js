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
    if (e.defaultPrevented || e.repeat) return

    if (this.keys.length >= this.limit) {
      this.keys.splice(this.keys.indexOf(this.lastKey), 1)
    }

    this.keys.push(e.key)
    this.keys.sort()

    this.lastKey = e.key

    if (this.keys.length === this.limit) {
      this.emit('fulfilled', this.keys.join('+'))
    }
  }

  onKeyRelease () {
    this.keys = []
    this.lastKey = null
  }

  startRecording () {
    this.element.addEventListener('keydown', this.onKeyDown, true)
    this.element.addEventListener('keyup', this.onKeyUp, true)
  }

  stopRecording () {
    this.onKeyRelease()
    this.element.removeEventListener('keydown', this.onKeyDown, true)
    this.element.removeEventListener('keyup', this.onKeyUp, true)
  }
}

export default Shortcut
