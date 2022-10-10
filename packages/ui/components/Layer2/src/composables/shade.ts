import { LayerProps } from '../../../Layer/props'
import {computed, CSSProperties, Ref, toRefs, unref} from 'vue'

export function useShade(props: LayerProps, zIndex: Ref<number>) {
  const { shade } = toRefs(props)

  const shadeStyles = computed((): CSSProperties => {
    return {
      'background-color': unref(shade)[1] || '#000',
      opacity: unref(shade)[0] || unref(shade),
      zIndex: unref(zIndex) - 1
    }
  })

  return {
    shadeStyles
  }
}
