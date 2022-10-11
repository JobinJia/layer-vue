import {ComponentInternalInstance, getCurrentInstance, onUnmounted, ref, shallowRef, toRefs, watch} from 'vue'
import {LayerProps} from "../components/Layer/props";

export interface LayerGlobalCacheRecord {
  maxmin: {
    isMax: boolean
    isMin: boolean
  }
}

export type LayerGlobalCache = WeakMap<ComponentInternalInstance, LayerGlobalCacheRecord>

const DEFAULT_GLOBAL_CACHE: LayerGlobalCacheRecord = {
  maxmin: {
    isMax: false,
    isMin: false
  }
}

const globalCache: LayerGlobalCache = new WeakMap()

export function useGlobalCache(props: LayerProps) {
  const { visible } = toRefs(props)

  const vm = getCurrentInstance()

  globalCache.set(vm, DEFAULT_GLOBAL_CACHE)

  const currentVmCache = ref<LayerGlobalCacheRecord>(DEFAULT_GLOBAL_CACHE)

  function updateGlobalCache(payload: Partial<LayerGlobalCacheRecord>) {
    const cache = globalCache.get(vm)
    const merged = {
      ...cache,
      ...payload
    }
    globalCache.set(vm, merged)
    currentVmCache.value = merged
  }

  function getLayerGlobalCache() {
    return globalCache.get(vm)
  }

  watch(visible, (val) => {
    if (!val) {
      globalCache.set(vm, DEFAULT_GLOBAL_CACHE)
      currentVmCache.value = DEFAULT_GLOBAL_CACHE
    }
  })

  return {
    currentVmCache,
    getLayerGlobalCache,
    updateGlobalCache
  }
}
