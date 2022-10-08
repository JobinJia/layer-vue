/**
 * 需要缓存全局的值, 与vue实例绑定
 */
export interface LayerStoreRecord {
  zIndex: number
}

export class LayerCache {
  // key: number
  cache: Map<number, LayerStoreRecord> = new Map<
    number,
    LayerStoreRecord
  >()
  constructor() {
    // this.key = key
  }
  getLastValue() {
    return [...this.cache].at(-1)[1]
  }
  getSize() {
    return this.cache.size
  }
  setCache(key: number, payload: LayerStoreRecord) {
    if (!this.cache.has(key)) {
      this.cache.set(key, payload)
    } else {
      const record = this.cache.get(key)
      this.cache.set(key, {
        ...record,
        ...payload
      })
    }
  }
  removeCache(key: number) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
  }
  hasCache(key: number) {
    return this.cache.has(key)
  }
  getCache(key: number) {
    return this.cache.get(key)
  }
}

// export function useLayerCache(payload: LayerStoreRecord) {
//   const key = getCurrentInstance()
//
//   const cache = new LayerCache(key)
//
//   onMounted(() => {
//     cache.setCache(key, payload)
//   })
//
//   onBeforeUnmount(() => {
//     cache.removeCache(key)
//   })
//
//   return {
//     cache
//   }
// }
