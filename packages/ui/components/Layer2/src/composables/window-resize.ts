import { useWindowSize } from '@vueuse/core'
import {toRefs, watch} from 'vue'
import {LayerProps} from "../../../Layer/props";

export function useWindowResize(props: LayerProps) {
  const { area } = toRefs(props)
  const { width, height } = useWindowSize()

  watch(
    () => [width.value, height.value],
    (w, h) => {

    },
    {
      immediate: true,
      deep: true
    }
  )
}
