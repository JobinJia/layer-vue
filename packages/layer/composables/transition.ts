import type { LayerProps } from '../components/Layer/props'
import { computed, toRefs, unref } from 'vue'
import { getDrawerAnimationClass } from '../utils/layerUtil'

export interface LayerTransition {
  in: string
  out: string
}

export function useLayerTransition(props: LayerProps) {
  const { offset, anim, type, isOutAnim } = toRefs(props)
  const layerTransition = computed<LayerTransition>(() => {
    return {
      in: unref(type) === 'iframe' ? getDrawerAnimationClass(unref(offset)) : `layer-anim layer-anim-0${unref(anim)}`,
      out:
        unref(type) === 'iframe'
          ? getDrawerAnimationClass(unref(offset), true)
          : unref(isOutAnim)
          ? `layer-anim-close`
          : ''
    }
  })
  return {
    layerTransition
  }
}
