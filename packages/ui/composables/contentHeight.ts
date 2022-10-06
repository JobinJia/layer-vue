import { LayerProps } from '../components/Layer/props'
import { CSSProperties, onMounted, ref, Ref, unref, watch } from 'vue'
import { getDomWidthAndHeight } from '../utils/dom'
import { windowViewHeight } from '../utils/window'

export function useContentHeight(
  props: LayerProps,
  layerModalRefEl: Ref<HTMLElement | null>,
  moveRefEl: Ref<HTMLElement | null>,
  modalContentRefEl: Ref<HTMLElement | null>,
  btnRefEl: Ref<HTMLElement | null>,
  height: Ref<number>
) {
  const { type, area, maxHeight, fixed } = unref(props)
  const contentStyles = ref<CSSProperties>({})

  function calcContentHeight() {
    const modalEle = unref(layerModalRefEl)
    const moveEle = unref(moveRefEl)
    const contentEle = unref(modalContentRefEl)
    const btnEle = unref(btnRefEl)
    if (moveEle === null || btnEle === null) {
      return
    }

    function setHeight() {
      const { domWidth: titleWidth, domHeight: titleHeight } = getDomWidthAndHeight(moveEle)
      const { domWidth: btnWidth, domHeight: btnHeight } = getDomWidthAndHeight(btnEle)
      const paddingValue = window.getComputedStyle(contentEle, null).getPropertyValue('padding-top')
      const paddingNum = paddingValue.match(/\d+/g)
      contentStyles.value = {
        height: unref(height) - titleHeight - btnHeight - 2 * parseFloat(paddingNum + '') + 'px'
      }
    }

    const typeVal = unref(type)
    const areaVal = unref(area)
    switch (typeVal) {
      default:
        if (areaVal[1] === '') {
          if (unref(maxHeight) > 0 && unref(height) > unref(maxHeight)) {
            height.value = unref(maxHeight)
            setHeight()
          } else if (unref(fixed) && area[1] >= windowViewHeight) {
            height.value = windowViewHeight
            setHeight()
          }
        } else {
          setHeight()
        }
        break
    }
  }

  onMounted(calcContentHeight)

  watch(
    height,
    () => {
      calcContentHeight()
    },
    { immediate: true }
  )

  return {
    contentStyles
  }
}
