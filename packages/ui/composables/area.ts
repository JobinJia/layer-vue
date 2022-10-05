import { type LayerProps } from '../components/Layer/props'
import { ref, toRefs, unref } from 'vue'
import { isNumber } from 'lodash'

export function useArea(props: LayerProps) {
  const { area } = toRefs(props)

  const width = ref<number>(-1)
  const height = ref<number>(-1)
  const areaVal = unref(area)
  if (isNumber(areaVal)) {
    width.value = areaVal
  } else if (Array.isArray(areaVal)) {
    const [cw, ch] = areaVal
    width.value = cw
    height.value = ch
  }
  return {
    width,
    height
  }
}
