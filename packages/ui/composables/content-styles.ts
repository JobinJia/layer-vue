import { CSSProperties, nextTick, onMounted, Ref, ref, toRefs, unref, watch } from 'vue'
import { until, useElementBounding, useElementSize, useWindowSize } from '@vueuse/core'
import {LayerProps} from "../components/Layer/props";
import {getDomWidthAndHeight, getStyle} from "../utils/dom";

export interface ContentStylesOptions {
  layerMainRefEl: Ref<HTMLElement | null>
  layerTitleRefEl: Ref<HTMLElement | null>
  layerBtnRefEl: Ref<HTMLElement | null>
  layerContentRefEl: Ref<HTMLElement | null>
  height: Ref<number>
}

export function useContentStyle(
  props: LayerProps,
  { layerMainRefEl, layerTitleRefEl, layerBtnRefEl, layerContentRefEl, height }: ContentStylesOptions
) {
  const { visible } = toRefs(props)

  const contentStyle = ref<CSSProperties>({})

  async function setContentHeight() {
    await until(layerContentRefEl).not.toBeNull()
    await until(layerTitleRefEl).not.toBeNull()
    await until(layerBtnRefEl).not.toBeNull()
    await until(layerMainRefEl).not.toBeNull()
    const ele = unref(layerContentRefEl)
    const styleVal = getStyle(ele, 'padding-top')
    // const { domHeight } = getDomWidthAndHeight(layerMainRefEl.value)
    // console.log('domHeight => ', domHeight, unref(height))
    const domHeight = unref(height)
    const { domHeight: titleHeight } = getDomWidthAndHeight(layerTitleRefEl.value)
    const { domHeight: btnHeight } = getDomWidthAndHeight(layerBtnRefEl.value)
    contentStyle.value = {
      height: domHeight - titleHeight - btnHeight - 2 * (parseFloat(styleVal) | 0) + 'px'
    }
  }

  watch(
    () => [visible.value, height.value],
    async ([val]) => {
      if (val) {
        await setContentHeight()
      }
    }
  )

  return {
    contentStyle
  }
}
