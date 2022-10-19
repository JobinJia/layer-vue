import type { LayerGlobalCacheRecord } from './layerCache'
import type { LayerProps } from '../components/Layer/props'
import { getCurrentInstance, ref, toRefs, watch } from 'vue'
import { createGlobalCache } from '../utils/createGlobalCache'
import { DEFAULT_GLOBAL_CACHE, LayerCache } from './layerCache'
import { tryOnBeforeUnmount } from '@vueuse/core'

export const globalData = new LayerCache()

export function useGlobalCache(props: LayerProps) {
  const { visible, zIndex } = toRefs(props)
  const hook = createGlobalCache(() => {
    const globalCacheIns = ref<LayerCache>(globalData)
    const globalCacheData = ref<LayerGlobalCacheRecord>(DEFAULT_GLOBAL_CACHE)

    const { uid } = getCurrentInstance()

    // if (globalData.getSize() === 0) {
    //   globalData.setCache(uid, {})
    // } else {
    //   const { zIndex: lastVal } = globalCacheIns.value.getMaxDataByKey('zIndex')
    //   globalData.setCache(uid, {
    //     zIndex: lastVal + 2
    //   })
    // }

    function updateGlobalCache(payload: Partial<LayerGlobalCacheRecord>) {
      const data = globalData.getCache(uid)
      const merged = {
        ...data,
        ...payload
      }
      globalData.setCache(uid, merged)
      globalCacheIns.value = globalData
      globalCacheData.value = merged
    }

    watch(visible, (val) => {
      if (val) {
        if (globalData.getSize() === 0) {
          globalData.setCache(uid, {})
        } else {
          const { zIndex: lastVal } = globalCacheIns.value.getMaxDataByKey('zIndex')
          globalData.setCache(uid, {
            zIndex: lastVal + 2
          })
        }
      }
      const data = globalData.getCache(uid)
      globalCacheIns.value = globalData
      globalCacheData.value = data
    })

    watch(
      zIndex,
      (zIndexValue) => {
        if (typeof zIndexValue === 'number') {
          globalCacheIns.value.setCache(uid, {
            zIndex: zIndexValue
          })
        }
      },
      { immediate: true }
    )

    function moveToTop() {
      const { zIndex: lastVal } = globalData.getMaxDataByKey('zIndex')
      // 已经是最顶层, 则不处理
      if (globalCacheData.value.zIndex === lastVal) return
      const current = lastVal + 2
      globalData.setCache(uid, { zIndex: current })
      globalCacheIns.value = globalData
      globalCacheData.value = globalCacheIns.value.getCache(uid)
    }

    tryOnBeforeUnmount(() => {
      globalData.removeCache(uid)
      globalCacheIns.value = globalData
    })

    return {
      globalCacheIns,
      globalCacheData,
      updateGlobalCache,
      moveToTop
    }
  })
  return hook()
}
