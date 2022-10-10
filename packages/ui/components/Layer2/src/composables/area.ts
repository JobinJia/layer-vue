import { type LayerProps } from '../../../Layer/props'
import { Ref, ref, toRefs, unref, watch } from 'vue'
import { isNumber } from 'lodash'
import { useElementSize, useWindowSize } from '@vueuse/core'

export function useArea(props: LayerProps, layerMainRefEl: Ref<HTMLElement | null>) {
  const { area, visible, maxWidth, maxHeight } = toRefs(props)

  const width = ref<number>(-1)
  const height = ref<number>(-1)

  const { width: winHeight } = useWindowSize({ listenOrientation: true })
  const { width: mainWidth } = useElementSize(layerMainRefEl)

  function calcArea() {
    const areaVal = unref(area)
    const maxWidthVal = unref(maxWidth)
    if (isNumber(areaVal)) {
      width.value = areaVal
    } else if (Array.isArray(areaVal)) {
      const [cw, ch] = areaVal
      width.value = cw
      height.value = ch
    } else {
      width.value = -1
      height.value = -1
    }
    if (areaVal[0] === '' && maxWidthVal > 0) {
      unref(mainWidth) > maxWidthVal && (width.value = maxWidthVal)
    }
    if (areaVal[1] === '') {
      if (maxHeight.value > 0 && areaVal[1] > maxHeight.value) {
        height.value = maxHeight.value
      } else if (props.fixed && areaVal[1] >= winHeight.value) {
        height.value = winHeight.value
      }
    }
  }

  watch(
    () => [visible.value, area.value],
    ([visibleVal]) => {
      if (visibleVal) {
        calcArea()
      }
    }
  )

  return {
    width,
    height
  }
}
