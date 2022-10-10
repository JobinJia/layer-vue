import { CSSProperties, nextTick, onMounted, Ref, ref, toRefs, unref, watch } from 'vue'
import { getDomWidthAndHeight, getStyle } from '../../../../utils/dom'
import { LayerProps } from '../../../Layer/props'
import { until, useElementBounding, useElementSize, useWindowSize } from '@vueuse/core'

export interface ContentStylesOptions {
  layerMainRefEl: Ref<HTMLElement | null>
  layerTitleRefEl: Ref<HTMLElement | null>
  layerBtnRefEl: Ref<HTMLElement | null>
  layerContentRefEl: Ref<HTMLElement | null>
}

export function useContentStyle(
  props: LayerProps,
  { layerMainRefEl, layerTitleRefEl, layerBtnRefEl, layerContentRefEl }: ContentStylesOptions
) {
  const { visible, offset, area, maxWidth, maxHeight, type, fixed } = toRefs(props)

  const contentStyle = ref<CSSProperties>({})

  // window
  const { width: windowWidth, height: windowHeight } = useWindowSize({
    listenOrientation: true,
    includeScrollbar: false
  })

  // main
  const { width: mainWidth, height: mainHeight } = useElementSize(layerMainRefEl)
  // title
  const { width: titleWidth, height: titleHeight } = useElementSize(layerTitleRefEl)
  // button
  const { width: btnWidth, height: btnHeight } = useElementSize(layerBtnRefEl)

  // main
  const { left: mainLeft, top: mainTop } = useElementBounding(layerMainRefEl, {
    reset: true,
    immediate: true,
    windowResize: true,
    windowScroll: true
  })
  // title
  const { left: titleLeft, top: titleTop } = useElementBounding(layerTitleRefEl)

  async function setContentHeight() {
    await until(layerContentRefEl).not.toBeNull()
    await until(layerTitleRefEl).not.toBeNull()
    await until(layerBtnRefEl).not.toBeNull()
    await until(layerMainRefEl).not.toBeNull()
    const ele = unref(layerContentRefEl)
    const styleVal = getStyle(ele, 'padding-top')
    const { domHeight } = getDomWidthAndHeight(layerMainRefEl.value)
    const { domHeight: titleHeight } = getDomWidthAndHeight(layerTitleRefEl.value)
    const { domHeight: btnHeight } = getDomWidthAndHeight(layerBtnRefEl.value)
    contentStyle.value = {
      height: domHeight - titleHeight - btnHeight - 2 * (parseFloat(styleVal) | 0) + 'px'
    }
  }

  watch(visible, async (val) => {
    if (val) {
      await setContentHeight()
    }
  })

  return {
    contentStyle
  }
}
