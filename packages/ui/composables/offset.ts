import type { Ref } from 'vue'
import type { LayerGlobalCacheRecord } from './layerCache'
import type { LayerProps } from '../components/Layer/props'

import { ref, toRefs, unref, watch } from 'vue'
import { until, useWindowSize } from '@vueuse/core'
import { isNumber } from 'lodash'
import { getDomWidthAndHeight } from '../utils/dom'


export interface OffsetOption {
  layerMainRefEl: Ref<HTMLElement | null>
  globalCacheData: Ref<LayerGlobalCacheRecord>
}

export function useOffset(props: LayerProps, { layerMainRefEl, globalCacheData }: OffsetOption) {
  const { visible } = toRefs(props)

  const left = ref<number>(0)
  const top = ref<number>(0)

  // window
  const { width: windowWidth, height: windowHeight } = useWindowSize({
    listenOrientation: true,
    includeScrollbar: false
  })

  async function calcOffset() {
    await until(layerMainRefEl).not.toBeNull()
    const { domWidth: mainWidth, domHeight: mainHeight } = getDomWidthAndHeight(layerMainRefEl.value)
    let offsetTop = (unref(windowHeight) - unref(mainHeight)) / 2
    let offsetLeft = (unref(windowWidth) - unref(mainWidth)) / 2

    const offsetVal = props.offset
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
          offsetLeft = unref(windowWidth) - unref(mainWidth)
          break
        case 'b':
          offsetTop = unref(windowHeight) - unref(mainHeight)
          break
        case 'l':
          offsetLeft = 0
          break
        case 'lt':
          offsetLeft = 0
          offsetTop = 0
          break
        case 'lb':
          offsetTop = unref(windowHeight) - unref(mainHeight)
          offsetLeft = 0
          break
        case 'rt':
          offsetTop = 0
          offsetLeft = unref(windowWidth) - unref(mainWidth)
          break
        case 'rb':
          offsetTop = unref(windowHeight) - unref(mainHeight)
          offsetLeft = unref(windowWidth) - unref(mainWidth)
          break
        default:
          break
      }
    }

    left.value = offsetLeft
    top.value = offsetTop
  }

  watch(
    () => [visible.value, windowWidth.value, windowHeight.value],
    async ([visibleVal]) => {
      if (visibleVal) {
        const globalCache = unref(globalCacheData)
        if (!globalCache.maxmin.isMax && !globalCache.maxmin.isMin) {
          await calcOffset()
        }
      }
    },
    { immediate: true, deep: true }
  )

  return {
    left,
    top
  }
}
