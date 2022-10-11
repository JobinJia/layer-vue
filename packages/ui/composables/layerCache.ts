import { CSSProperties } from 'vue'

/**
 * 需要缓存全局的值, 与vue实例绑定
 */
export interface LayerStoreRecord {
  zIndex: number
  isMax: boolean
  isMin: boolean
  maxMinState: {
    height: number
    width: number
    position: CSSProperties['position']
    left: number
    top: number
  }
}

const DEFAULT_CACHE: LayerStoreRecord = {
  zIndex: 19920115,
  isMax: false,
  isMin: false,
  maxMinState: {
    height: 0,
    width: 0,
    position: 'fixed',
    left: 0,
    top: 0
  }
}

export class LayerCache {
  // key: number
  cache: Map<number, LayerStoreRecord> = new Map<number, LayerStoreRecord>()
  constructor() {
    // this.key = key
  }
  getLastValue() {
    return [...this.cache].at(-1)[1]
  }
  getSize() {
    return this.cache.size
  }
  setCache(key: number, payload: Partial<LayerStoreRecord>) {
    if (!this.cache.has(key)) {
      this.cache.set(key, { ...DEFAULT_CACHE, ...payload })
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
