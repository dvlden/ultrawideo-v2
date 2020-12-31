// Based on
// https://github.com/mdn/dom-examples/blob/bdade19d93216597e104b02b819443a428b2dffa/pointerevents/Pinch_zoom_gestures.html

import EventEmitter from 'eventemitter3'

class Gesture extends EventEmitter {
  constructor (element = document) {
    super()

    this.element = element

    // Global vars to cache event state
    this.evCache = new Array()
    this.prevDiff = -1
    this.trigger = true

    this.onPointerDown = this.pointerDownHandler.bind(this)
    this.onPointerMove = this.pointerMoveHandler.bind(this)
    this.onPointerUp = this.pointerUpHandler.bind(this)
  }

  startRecording () {
    // Install event handlers for the pointer target
    this.element.addEventListener('pointerdown', this.onPointerDown, true)
    this.element.addEventListener('pointermove', this.onPointerMove, true)

    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    this.element.addEventListener('pointerup', this.onPointerUp, true)
    this.element.addEventListener('pointercancel', this.onPointerUp, true)
    this.element.addEventListener('pointerout', this.onPointerUp, true)
    this.element.addEventListener('pointerleave', this.onPointerUp, true)
  }

  stopRecording () {
    this.element.removeEventListener('pointerdown', this.onPointerDownr, true)
    this.element.removeEventListener('pointermove', this.onPointerMove, true)

    this.element.removeEventListener('pointerup', this.onPointerUp, true)
    this.element.removeEventListener('pointercancel', this.onPointerUp, true)
    this.element.removeEventListener('pointerout', this.onPointerUp, true)
    this.element.removeEventListener('pointerleave', this.onPointerUp, true)
  }


  pointerDownHandler (ev) {
    if (ev.defaultPrevented || ev.repeat) return

    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    this.evCache.push(ev)
  }

  pointerMoveHandler (ev) {
    if (ev.defaultPrevented || ev.repeat) return

    // This function implements a 2-pointer horizontal pinch/zoom gesture. 
    //
    // If the distance between the two pointers has increased -> zoom in, 
    // if the distance is decreasing -> zoom out

    // Find this event in the cache and update its record with this event
    for (var i = 0; i < this.evCache.length; i++) {
      if (ev.pointerId == this.evCache[i].pointerId) {
        this.evCache[i] = ev
        break
      }
    }

    // Cancel the event if the mode has been allready changed
    if (!this.trigger) return

    // If two pointers are down, check for pinch gestures
    if (this.evCache.length == 2) {
      // Calculate the distance between the two pointers
      var curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);

      if (this.prevDiff > 0) {
        if (curDiff > this.prevDiff) {
          // The distance between the two pointers has increased
          this.emit('fulfilled', 'zoomin')
        }
        if (curDiff < this.prevDiff) {
          // The distance between the two pointers has decreased
          this.emit('fulfilled', 'zoomout')
        }

        // Prevent the event from triggering multiple times
        if (curDiff !== this.prevDiff)
          this.trigger = false
      }

      // Cache the distance for the next move event 
      this.prevDiff = curDiff
    }
  }

  pointerUpHandler (ev) {
    // Remove this pointer from the cache
    this.removeEvent(ev)

    // If the number of pointers down is less than two then reset diff
    // and reenable triggering
    if (this.evCache.length < 2) {
      this.prevDiff = -1
      this.trigger = true
    }
  }

  removeEvent (ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < this.evCache.length; i++) {
      if (this.evCache[i].pointerId == ev.pointerId) {
        this.evCache.splice(i, 1)
        break
      }
    }
  }

}

export default Gesture
