import { LayerProps } from '../../../Layer/props'
import {
  ref,
  Ref,
  toRefs,
  unref,
  watch,
} from 'vue'
import { useElementBounding, useElementSize, useWindowSize } from '@vueuse/core'
import { isNumber } from 'lodash'

export function useOffset(
  props: LayerProps,
  elements: {
    layerMainRefEl: Ref<HTMLElement | null>
    layerTitleRefEl: Ref<HTMLElement | null>
    layerContentRefEl: Ref<HTMLElement | null>
    layerBtnRefEl: Ref<HTMLElement | null>
  }
) {
  const { visible } = toRefs(props)

  const left = ref<number>(0)
  const top = ref<number>(0)

  // window
  const { width: windowWidth, height: windowHeight } = useWindowSize({
    listenOrientation: true,
    includeScrollbar: false
  })

  // main
  const { width: mainWidth, height: mainHeight } = useElementSize(elements.layerMainRefEl)
  // title
  const { width: titleWidth, height: titleHeight } = useElementSize(elements.layerTitleRefEl)
  // button
  const { width: btnWidth, height: btnHeight } = useElementSize(elements.layerBtnRefEl)

  // main
  const { left: mainLeft, top: mainTop } = useElementBounding(elements.layerMainRefEl, {
    reset: true,
    immediate: true,
    windowResize: true,
    windowScroll: true
  })
  // title
  const { left: titleLeft, top: titleTop } = useElementBounding(elements.layerTitleRefEl)

  function calcOffset() {
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
    () => [visible, windowWidth.value, windowHeight.value, mainWidth.value, mainHeight.value],
    async ([visibleVal, ww, wh, mw, mh]) => {
      if (visibleVal) {
        calcOffset()
      }
    },
    { deep: true }
  )

  return {
    left,
    top
  }
}
