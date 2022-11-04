export { makeDraggable }

function makeDraggable(element, keys = {}) {
  if (element.dataset.draggable) return

  Object.assign(element.style, {position: 'absolute', transform: 'translateX(0)'})
  element.addEventListener('mousedown', handleGrab(keys))
  element.setAttribute('data-draggable', '')
}

function handleGrab(keys) {
  return function (e) {
    if (
      keys.shift && !e.shiftKey ||
      keys.ctrl && !e.ctrlKey ||
      keys.alt && !e.altKey
    ) return

    this.style.pointerEvents = 'none'
    this.dataset.x = e.clientX - this.offsetLeft
    this.dataset.y = e.clientY - this.offsetTop
    this.dataset.w = this.offsetWidth
    this.dataset.h = this.offsetHeight

    handleDrag.last = handleDrag(this)
    addEventListener('mousemove', handleDrag.last)
    addEventListener('mouseup', handleDrop(this), {once: true})
  }
}

function handleDrag(that) {
  return function (e) {
    const x = e.clientX - that.dataset.x
    const y = e.clientY - that.dataset.y

    that.style.left = Math.min(Math.max(x, 0), innerWidth - that.dataset.w) + 'px'
    that.style.top = Math.min(Math.max(y, 0), innerHeight - that.dataset.h - 1) + 'px'
  }
}

function handleDrop(that) {
  return function () {
    removeEventListener('mousemove', handleDrag.last)

    that.removeAttribute('data-x')
    that.removeAttribute('data-y')
    that.style.pointerEvents = null

    that.optimizeDirections?.()
  }
}
