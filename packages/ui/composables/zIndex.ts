import { type LayerProps } from '../components/Layer/props'
import { toRefs, unref, watch, ref, onBeforeUnmount, getCurrentInstance } from 'vue'
import { LayerCache } from './layerCache'

const cache = new LayerCache()

export function useZIndex(props: LayerProps) {
  const vm = getCurrentInstance()
  const { uid } = vm

  const { zIndex, visible } = toRefs(props)

  const currentIndex = ref<number>(0)

  watch(
    zIndex,
    (value) => {
      if (cache.getSize() === 0) {
        cache.setCache(uid, { zIndex: value })
        currentIndex.value = value
      } else {
        const { zIndex } = cache.getLastValue()
        cache.setCache(uid, {
          zIndex: zIndex + 2
        })
        currentIndex.value = zIndex + 2
      }
    },
    { immediate: true }
  )

  watch(
    visible,
    (val) => {
      // 打开的时候 设置zIndex
      if (val) {
        const { zIndex } = cache.getLastValue()
        if (unref(currentIndex) !== zIndex) {
          currentIndex.value = zIndex
        } else {
          currentIndex.value = zIndex + 2
          cache.setCache(uid, {
            zIndex: zIndex + 2
          })
        }
      }
    },
    { immediate: true }
  )

  function moveToTop() {
    const { zIndex } = cache.getLastValue()
    // 已经是最顶层, 则不处理
    if (currentIndex.value === zIndex) return
    // zIndexSet.delete(unref(currentIndex))
    cache.removeCache(uid)
    const current = zIndex + 2
    cache.setCache(uid, { zIndex: current })
    currentIndex.value = current
  }

  onBeforeUnmount(() => {
    cache.removeCache(uid)
  })

  return {
    zIndex: currentIndex,
    moveToTop
  }
}
