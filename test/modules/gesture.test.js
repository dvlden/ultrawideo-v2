import Gesture from '@/modules/gesture'

// Had to use recreate PointerEvent, because jest throws
// an error with the built in PointerEvent:
// ReferenceError: PointerEvent is not defined
// This class only implements the field(s) used by
// the Gesture class
class PointerEvent extends MouseEvent {
  constructor(type, PointerEventInit) {
    super(type, PointerEventInit)
    if (PointerEventInit !== undefined) {
      this.pointerId = PointerEventInit['pointerId']
    }
  }
}

describe('tests for gesture module', () => {
  beforeAll(() => {
    global.instance = new Gesture(document)
  })

  afterAll(() => {
    delete global.instance
  })

  it('should be valid instance', () => {
    expect(instance).toBeInstanceOf(Gesture)
  })

  it('should have default element if not passed as arguments', () => {
    const customInstance = new Gesture

    expect(customInstance.element).toBe(document)
  })

  it('should be possible to pass an element to the instance', () => {
    const mockInstance = jest.fn((element) => new Gesture(element))

    mockInstance(document.body)

    expect(mockInstance).toHaveBeenCalledWith(document.body)
  })

  describe('test startRecording method', () => {
    beforeEach(() => {
      jest.spyOn(instance, 'onPointerDown')
      jest.spyOn(instance, 'onPointerUp')
      instance.startRecording()
    })

    afterEach(() => {
      jest.restoreAllMocks()
      instance.stopRecording()
    })

    it('should trigger onPointerDown when event is emitted', () => {
      instance.element.dispatchEvent(
        new PointerEvent('pointerdown')
      )

      expect(instance.onPointerDown).toHaveBeenCalledTimes(1)
    })

    it('should trigger onPointerUp when event is emitted', () => {
      instance.element.dispatchEvent(
        new PointerEvent('pointerup')
      )

      expect(instance.onPointerUp).toHaveBeenCalledTimes(1)
    })
  })

  describe('test stopRecording method', () => {
    beforeAll(() => {
      jest.spyOn(instance, 'onPointerDown')
      jest.spyOn(instance, 'onPointerUp')
      instance.startRecording()
      instance.stopRecording()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not trigger onPointerDown when event is emitted', () => {
      instance.element.dispatchEvent(
        new PointerEvent('pointerdown')
      )

      expect(instance.onPointerDown).not.toHaveBeenCalled()
    })

    it('should trigger onPointerUp when event is emitted', () => {
      instance.element.dispatchEvent(
        new PointerEvent('pointerup')
      )

      expect(instance.onPointerUp).not.toHaveBeenCalled()
    })
  })

  describe('test onPointerUp method', () => {
    beforeAll(() => {
      global.instance = new Gesture(document)
    })

    afterAll(() => {
      delete global.instance
    })

    it('should remove an event from evCache array', () => {
      
      var ev = new PointerEvent('pointerdown', {pointerId: 2})

      instance.evCache = [
        new PointerEvent('pointerdown', {pointerId: 1}),
          ev,
          new PointerEvent('pointerdown', {pointerId: 3})
      ]

      instance.removeEvent(ev)

      expect(instance.evCache).not.toContain(ev)
    })
  })
  describe('test onPointerDown method', () => {
    beforeAll(() => {
      global.instance = new Gesture(document)
    })
  
    afterAll(() => {
      delete global.instance
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should not execute if event is prevented', () => {
      jest.spyOn(instance, 'onPointerDown')

      document.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        instance.onPointerDown(e)
      })

      document.dispatchEvent(
        new PointerEvent('pointerdown', { cancelable: true })
      )

      expect(instance.onPointerDown).toHaveReturnedWith(undefined)
      expect(instance.evCache.length).toBe(0)
    })

    it('should add a pointer from event to the evCache array', () => {
      var e = new PointerEvent('pointerdown')
      instance.onPointerDown(e)

      expect(instance.evCache).toEqual([e])
    })
  })

  describe('test onPointerMove method', () => {
    beforeAll(() => {
      global.instance = new Gesture(document)
    })
      afterAll(() => {
      delete global.instance
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should calculate the difference between the event\'s clientX', () => {
      instance.evCache = [
        new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1 }),
        new PointerEvent('pointerdown', { clientX: 15, clientY: 15, pointerId: 2 })
      ]

      instance.onPointerMove(
        new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 2 })
      )

      expect(instance.prevDiff).toBe(10)
    })

    it('should emit the fulfilled event and return zoomin', () => {
      jest.spyOn(instance, 'emit')

      instance.evCache = [
        new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1 }),
        new PointerEvent('pointerdown', { clientX: 15, clientY: 15, pointerId: 2 })
      ]
      instance.prevDiff = 5

      instance.onPointerMove(
        new PointerEvent('pointermove', { clientX: 20, clientY: 20, pointerId: 2 })
      )

      expect(instance.emit.mock.calls[0]).toContain('zoomin')
    })

    it('should emit the fulfilled event and return zoomout', () => {
      jest.spyOn(instance, 'emit')

      instance.evCache = [
        new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1 }),
        new PointerEvent('pointerdown', { clientX: 15, clientY: 15, pointerId: 2 })
      ]
      instance.prevDiff = 5
      instance.trigger = true

      instance.onPointerMove(
        new PointerEvent('pointermove', { clientX: 12, clientY: 12, pointerId: 2 })
      )

      expect(instance.emit.mock.calls[0]).toContain('zoomout')
    })
  })

  describe('test onPointerUp method', () => {
    beforeAll(() => {
      global.instance = new Gesture(document)
    })

    afterAll(() => {
      delete global.instance
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should reset prevdiff and tigger and remove it from array of evCache', () => {

      // Make some moves to perform a zoom
      instance.evCache = [
        new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1 }),
        new PointerEvent('pointerdown', { clientX: 15, clientY: 15, pointerId: 2 })
      ]
      instance.prevDiff = 5
      instance.trigger = true

      instance.onPointerMove(
        new PointerEvent('pointermove', { clientX: 12, clientY: 12, pointerId: 2 })
      )

      instance.onPointerUp(new PointerEvent('pointerup', { pointerId: 1 }))

      expect(instance.evCache).toHaveLength(1)
      expect(instance.prevDiff).toBe(-1)
      expect(instance.trigger).toBe(true)
    })
  })

})
