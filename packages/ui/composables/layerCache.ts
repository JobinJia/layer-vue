import { type ComponentInternalInstance, onMounted, Ref } from 'vue'
import { ref, shallowRef, getCurrentInstance } from 'vue'

export interface LayerStoreRecord {
  offsetTop: number
  offsetLeft: number
  width: number
  height: number
}

// export const layerCache = shallowRef<WeakMap<ComponentInternalInstance, LayerStoreRecord>>(new WeakMap())
const layerCache: WeakMap<ComponentInternalInstance, LayerStoreRecord> = new WeakMap()
export function useLayerCache(cache: LayerStoreRecord) {
  const vm = getCurrentInstance()

  function setCache() {
    layerCache.set(vm, cache)
  }

  onMounted(() => {
    setCache()
  })

  function getCache(vm: ComponentInternalInstance) {
    return layerCache.get(vm)
  }

  return {
    getCache
  }
}
