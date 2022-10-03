import { LayerProps } from '../components/Layer/props'
import { toRefs, unref } from 'vue'
import { isNumber } from 'lodash'

export function useArea(props: LayerProps, el: HTMLElement) {
  const { area } = toRefs(props)
  let width = -1
  let height = -1
  const areaVal = unref(area)
  if (isNumber(areaVal)) {
    width = areaVal
  } else if (Array.isArray(areaVal)) {
    const [cw, ch] = areaVal
    width = cw
    height = ch
  }
  return {
    width,
    height
  }
}
