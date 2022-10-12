/**
 * 需要缓存全局的值, 与vue实例绑定
 */
import { maxBy, minBy } from 'lodash'

export interface LayerGlobalCacheRecord {
  // z-index
  zIndex: number
  // max and min state
  maxmin: {
    isMax: boolean
    isMin: boolean
  }
}

export const DEFAULT_GLOBAL_CACHE: LayerGlobalCacheRecord = {
  zIndex: 19920115,
  maxmin: {
    isMax: false,
    isMin: false
  }
}

export class LayerCache {
  cache: Map<number, LayerGlobalCacheRecord>
  minStackCount: number
  constructor() {
    this.cache = new Map<number, LayerGlobalCacheRecord>()
    this.minStackCount = 0
  }
  getMaxDataByKey(key: keyof LayerGlobalCacheRecord) {
    const values = this.cache.values()
    return maxBy([...values], (it) => it[key])
  }
  getMinDataByKey(key: keyof LayerGlobalCacheRecord) {
    const values = this.cache.values()
    return minBy([...values], (it) => it[key])
  }
  getLastValue() {
    return [...this.cache].at(-1)[1]
  }
  getSize() {
    return this.cache.size
  }
  setCache(key: number, payload: Partial<LayerGlobalCacheRecord>) {
    if (!this.cache.has(key)) {
      this.cache.set(key, { ...DEFAULT_GLOBAL_CACHE, ...payload })
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
