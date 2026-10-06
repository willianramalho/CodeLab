import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Chama `handler` quando o usuário aperta o mouse fora do elemento de
 * `elementRef` (uma ref de template). Usa `mousedown` no document, para
 * fechar antes de o clique "completar" em outro elemento.
 */
export function useClickOutside(elementRef, handler) {
  function onMouseDown(event) {
    const el = elementRef.value
    if (el && !el.contains(event.target)) {
      handler(event)
    }
  }

  onMounted(() => document.addEventListener('mousedown', onMouseDown))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onMouseDown))
}
