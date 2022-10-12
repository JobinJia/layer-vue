import { type LayerProps } from '../components/Layer/props'
import { type Ref } from 'vue'
import { type LayerGlobalCacheRecord } from './layerCache'
import { ref, toRefs, unref, watch } from 'vue'
import { until, useElementSize, useWindowSize } from '@vueuse/core'

export interface AreaOption {
  layerMainRefEl: Ref<HTMLElement | null>
  globalCacheData: Ref<LayerGlobalCacheRecord>
}

export function useArea(props: LayerProps, { layerMainRefEl, globalCacheData }: AreaOption) {
  const { area, visible, maxWidth, maxHeight } = toRefs(props)

  const width = ref<number>(-1)
  const height = ref<number>(-1)

  const { height: winHeight } = useWindowSize({ listenOrientation: true })
  const { width: mainWidth } = useElementSize(layerMainRefEl)

  async function calcArea() {
    // 最小化时不计算宽高
    if (unref(globalCacheData).maxmin.isMin) {
      return
    }
    await until(layerMainRefEl).not.toBeNull()
    const areaVal = unref(area)
    const maxWidthVal = unref(maxWidth)

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

    width.value = areaVal[0]
    height.value = areaVal[1]
  }

  watch(
    () => [visible.value, area.value],
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
