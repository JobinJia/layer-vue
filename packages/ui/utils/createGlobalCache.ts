import { effectScope } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'

export type CreateGlobalCacheReturn<T> = () => T
export function createGlobalCache<T>(factory: () => T): CreateGlobalCacheReturn<T> {
  let initialized = false
  let state: T
  const scope = effectScope(true)

  return () => {
    if (!initialized) {
      state = scope.run(factory)!
      initialized = true
    }
    tryOnScopeDispose(() => {
      scope.stop()
    })
    return state
  }
}
