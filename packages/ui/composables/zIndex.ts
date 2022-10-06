import { type LayerProps } from '../components/Layer/props'
import { toRefs, unref, watch, ref, onBeforeUnmount } from 'vue'

const zIndexSet = new Set<number>()

export function useZIndex(props: LayerProps) {
  const { zIndex, visible } = toRefs(props)

  watch(
    zIndex,
    (val) => {
      if (zIndexSet.size === 0) {
        zIndexSet.add(val)
      } else {
        const lastVal = Array.from(zIndexSet).pop()
        zIndexSet.add(lastVal + 1)
      }
    },
    { immediate: true }
  )

  const currentIndex = ref<number>(0)

  watch(
    visible,
    (val) => {
      const lastVal = Array.from(zIndexSet).pop()
      // 打开的时候 设置zIndex
      if (val) {
        if (unref(currentIndex.value) !== lastVal) {
          currentIndex.value = lastVal
        } else {
          currentIndex.value = lastVal + 1
          zIndexSet.add(lastVal + 1)
        }
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    // 离开时,当删除
    const lastVal = Array.from(zIndexSet).pop()
    zIndexSet.delete(lastVal)
  })

  function moveToTop() {
    const lastVal = Array.from(zIndexSet).pop()
    // 已经是最顶层, 则不处理
    if (currentIndex.value === lastVal) return
    zIndexSet.delete(unref(currentIndex))
    const current = lastVal + 1
    zIndexSet.add(current)
    currentIndex.value = current
  }

  return {
    zIndex: currentIndex,
    moveToTop
  }
}
