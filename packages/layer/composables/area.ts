import type { LayerProps } from '../components/Layer/props'
import type { Ref } from 'vue'
import type { LayerGlobalCacheRecord } from './layerCache'
import { ref, toRefs, unref, watch } from 'vue'
import { until, useElementSize, useWindowSize } from '@vueuse/core'
import {isArray} from "lodash";

export interface AreaOption {
  layerMainRefEl: Ref<HTMLElement | null>
  globalCacheData: Ref<LayerGlobalCacheRecord>
}

export function useArea(props: LayerProps, { layerMainRefEl, globalCacheData }: AreaOption) {
  const { area, maxWidth, type, offset } = toRefs(props)

  const width = ref<number>(-1)
  const height = ref<number>(-1)

  const { height: winHeight, width: winWidth } = useWindowSize({ listenOrientation: true })
  const { width: mainWidth } = useElementSize(layerMainRefEl)

  async function calcArea() {
    // 最小化时不计算宽高
    if (unref(globalCacheData).maxmin.isMin) {
      return
    }
    await until(layerMainRefEl).not.toBeNull()
    const areaVal = unref(area)
    const maxWidthVal = unref(maxWidth)

    let innerArea = [-1, -1]

    if (isArray(areaVal)) {
      innerArea[0] = areaVal[0] === '' ? -1 : areaVal[0]
      innerArea[1] = areaVal[1]
    }

    // offset val
    const offsetVal = unref(offset)

    if (unref(type)) {
      switch (unref(type)) {
        case 'drawer':
          if (offsetVal === 'lt' || offsetVal === 'rt') {
            innerArea = [innerArea[0], unref(winHeight)]
          }
          if (offsetVal === 't') {
            innerArea = [unref(winWidth), innerArea[1]]
          }
          if (offsetVal === 'b') {
            innerArea = [unref(winWidth), innerArea[1]]
          }
          break
        default:
          break
      }
    }

    if (innerArea[0] === -1 && maxWidthVal > 0 && areaVal === 'auto') {
      unref(mainWidth) > maxWidthVal && (width.value = maxWidthVal)
    }
    if (innerArea[1] === -1) {
      if (props.maxHeight && props.maxHeight > 0 && innerArea[1] > props.maxHeight) {
        height.value = props.maxHeight
      } else if (props.fixed && innerArea[1] >= winHeight.value) {
        height.value = winHeight.value
      }
    }

    width.value = innerArea[0]
    height.value = innerArea[1]
  }

  watch(
    () => [props.visible, props.area, winWidth.value, winHeight.value],
    async ([visibleVal]) => {
      if (visibleVal) {
        await calcArea()
      } else {
        width.value = -1
        height.value = -1
      }
    },
    {
      immediate: true,
      deep: true
    }
  )

  return {
    width,
    height
  }
}
