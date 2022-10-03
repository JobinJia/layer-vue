import { ref, unref } from 'vue'

export const zIndex = ref<number>(19920115)

export function useZIndex() {
  const current = unref(zIndex)
  zIndex.value++
  return {
    zIndex: current + 1
  }
}
