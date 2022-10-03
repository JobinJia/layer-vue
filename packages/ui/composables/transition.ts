import { type LayerTransitionType } from '../components/Layer/interface'
import { LayerProps, type Move } from '../components/Layer/props'
import {computed, ExtractPropTypes, toRefs, unref} from 'vue'
import { getDrawerAnimationClass } from '../utils/layer-util'

export interface LayerTransition {
  in: string
  out: string
}

export function useLayerTransition(props: LayerProps) {
  const { offset, anim, type, isOutAnim } = toRefs(props)
  const layerTransition = computed<LayerTransition>(() => {
    return {
      in: unref(type) === 2 ? getDrawerAnimationClass(unref(offset)) : `layer-anim layer-anim-0${unref(anim)}`,
      out: unref(type) === 2 ? getDrawerAnimationClass(unref(offset), true) : unref(isOutAnim) ? `layer-anim-close` : ''
    }
  })
  return {
    layerTransition
  }
}

export function useLayerMove(move: Move) {
  if (move === false) {
    return ''
  }
  const moveClassNames = ['layui-layer-title']
}
