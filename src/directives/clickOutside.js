/**
 * Global v-click-outside directive.
 *
 * Usage:
 *  <div v-click-outside="() => (open = false)">...</div>
 *
 * Notes:
 * - We attach the document listener in a setTimeout(0) so the click that opens
 *   the menu doesn't immediately close it.
 * - The handler receives the original DOM event.
 */
export const clickOutside = {
  mounted(el, binding) {
    const onClick = (event) => {
      if (el === event.target || el.contains(event.target)) return
      if (typeof binding.value === 'function') binding.value(event)
    }

    // Store handler reference for removal on unmount
    el.__clickOutsideHandler__ = onClick

    setTimeout(() => {
      document.addEventListener('click', onClick)
    }, 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutsideHandler__)
    delete el.__clickOutsideHandler__
  }
}




