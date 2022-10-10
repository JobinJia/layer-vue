import { type LayerProps } from '../components/Layer/props'
import { onBeforeUnmount, type Ref, watchEffect } from 'vue'
import { watch, ref, toRefs, unref } from 'vue'
import { isNumber } from 'lodash'
import { until, useWindowSize } from '@vueuse/core'
import { getDomWidthAndHeight } from '../utils/dom'

export function useOffset(props: LayerProps, layerModalRefEl: Ref<HTMLElement | null>) {
  const { offset, visible } = toRefs(props)
  const offsetTopRef = ref(0)
  const offsetLeftRef = ref(0)

  // window
  const { width: ww, height: wh } = useWindowSize()

  async function calcOffset() {
    await until(layerModalRefEl).not.toBeNull()
    const [domWidth, domHeight] = getDomWidthAndHeight(layerModalRefEl.value)
    console.log(domHeight)
    let offsetTop = (unref(wh) - unref(domHeight)) / 2
    let offsetLeft = (unref(ww) - unref(domWidth)) / 2
    const offsetVal = unref(offset)
    if (isNumber(offsetVal)) {
      offsetTop = offsetVal
    } else if (Array.isArray(offsetVal)) {
      const [t, l] = offsetVal
      offsetTop = t
      offsetLeft = l
    } else if (offsetVal !== 'auto') {
      switch (offsetVal) {
        case 't':
          offsetTop = 0
          break
        case 'r':
          offsetLeft = unref(ww) - unref(domWidth)
          break
        case 'b':
          offsetTop = unref(wh) - unref(domHeight)
          break
        case 'l':
          offsetLeft = 0
          break
        case 'lt':
          offsetLeft = 0
          offsetTop = 0
          break
        case 'lb':
          offsetTop = unref(wh) - unref(domHeight)
          offsetLeft = 0
          break
        case 'rt':
          offsetTop = 0
          offsetLeft = unref(ww) - unref(domWidth)
          break
        case 'rb':
          offsetTop = unref(wh) - unref(domHeight)
          offsetLeft = unref(ww) - unref(domWidth)
          break
        default:
          break
      }
    }
    offsetTopRef.value = offsetTop
    offsetLeftRef.value = offsetLeft
  }

  watch(
    offset,
    async () => {
      if (unref(visible)) {
        await calcOffset()
      }
    },
    { deep: true, flush: 'post' }
  )

  watch(
    visible,
    async (visibleValue) => {
      if (visibleValue) {
        await calcOffset()
      }
    },
    { immediate: true, flush: 'post' }
  )

  return {
    offsetTop: offsetTopRef,
    offsetLeft: offsetLeftRef
  }
}
