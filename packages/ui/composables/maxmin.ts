import { type LayerProps } from '../components/Layer/props'
import { type CSSProperties, Ref } from 'vue'
import { ref, toRefs, unref, watch } from 'vue'
import { getDomPosition, getDomWidthAndHeight } from '../utils/dom'
import { windowViewHeight } from '../utils/window'

export function useMinMax(
  props: LayerProps,
  nature: { offsetTop: Ref<number>; offsetLeft: Ref<number>; width: Ref<number>; height: Ref<number> },
  layerModalRefEl: Ref<HTMLElement | null>,
  titleRefEl: Ref<HTMLElement | null>
) {
  const { type, maxmin, minStack } = toRefs(props)

  const openMaxMin = ref<boolean>(false)
  const showMinIcon = ref<boolean>(true)
  const minIconClasses = ref<string[]>(['layui-layer-max'])

  let minIndex = 0
  const settings = {
    width: 180,
    height: 0, //titHeight
    position: 'fixed',
    overflow: 'hidden',
    left: 0, // 181
    top: 0
  }

  const minIconStyles = ref<CSSProperties>({
    display: 'inline-block'
  })

  watch(
    type,
    (typeVal) => {
      if (typeVal === 'page') {
        openMaxMin.value = unref(maxmin) || true
      } else {
        openMaxMin.value = unref(maxmin)
      }
    },
    { immediate: true }
  )

  function setCache() {
    const modalEle = unref(layerModalRefEl)
    if (modalEle === null) {
      return
    }
    const { domWidth: width, domHeight: height } = getDomWidthAndHeight(modalEle)
    const { left, top } = getDomPosition(modalEle)
    const cache = {
      width,
      height,
      left,
      top
    }
  }

  function min() {
    setCache()
    minIconStyles.value = {
      display: 'none'
    }
    minIconClasses.value.push('layui-layer-maxmin')
    const { domHeight: titHeight } = getDomWidthAndHeight(unref(titleRefEl))
    settings.height = titHeight
    if (unref(minStack)) {
      settings.top = windowViewHeight - titHeight
      minIndex++
    }
    showMinIcon.value = false
    nature.height.value = settings.height
    nature.width.value = settings.width
    nature.offsetLeft.value = settings.left
    nature.offsetTop.value = settings.top
  }
  function max() {}

  return {
    openMaxMin,
    showMinIcon,
    minIconClasses,
    min,
    max,
  }
}
