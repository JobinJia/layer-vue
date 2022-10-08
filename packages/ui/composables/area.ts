import { type LayerProps } from '../components/Layer/props'
import { ref, toRefs, unref, watch } from 'vue'
import { isNumber } from 'lodash'

export function useArea(props: LayerProps) {
  const { area, visible } = toRefs(props)

  const width = ref<number>(-1)
  const height = ref<number>(-1)

  function calcArea() {
    const areaVal = unref(area)
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
  }

  watch(
    area,
    () => {
      calcArea()
    },
    { immediate: true, deep: true }
  )

  watch(
    visible,
    (value) => {
      if (value) {
        calcArea()
      }
    },
    { immediate: true }
  )

  return {
    width,
    height
  }
}
