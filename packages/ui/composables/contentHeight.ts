import { type LayerProps } from '../components/Layer/props'
import { type CSSProperties, type Ref } from 'vue'
import { ref, unref, watch, toRefs } from 'vue'
import { until, useWindowSize } from '@vueuse/core'
import { getDomWidthAndHeight, getStyle } from '../utils/dom'

export function useContentHeight(
  props: LayerProps,
  layerModalRefEl: Ref<HTMLElement | null>,
  moveRefEl: Ref<HTMLElement | null>,
  modalContentRefEl: Ref<HTMLElement | null>,
  btnRefEl: Ref<HTMLElement | null>,
  height: Ref<number>
) {
  const { visible, type, area, maxHeight, fixed } = toRefs(props)
  const contentStyles = ref<CSSProperties>({})

  // windows
  const { height: wh } = useWindowSize()

  async function calcContentHeight() {
    await until(modalContentRefEl).not.toBeNull()
    await until(moveRefEl).not.toBeNull()
    await until(btnRefEl).not.toBeNull()

    const contentEle = unref(modalContentRefEl)
    const moveEle = unref(moveRefEl)
    const btnEle = unref(btnRefEl)

    function setHeight() {
      const { domHeight: titleHeight } = getDomWidthAndHeight(moveEle)
      const { domHeight: btnHeight } = getDomWidthAndHeight(btnEle)
      const paddingValue = getStyle(contentEle, 'padding-top')
      const paddingNum = paddingValue.match(/\d+/g)
      if (unref(height) === -1) {
        contentStyles.value = {
          height: 'unset'
        }
      } else {
        contentStyles.value = {
          height: unref(height) - unref(titleHeight) - unref(btnHeight) - 2 * parseFloat(paddingNum + '') + 'px'
        }
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
          } else if (unref(fixed) && areaVal[1] >= wh.value) {
            height.value = wh.value
            setHeight()
          }
        } else {
          setHeight()
        }
        break
    }
  }

  watch(
    height,
    async () => {
      await calcContentHeight()
    },
    { immediate: true }
  )

  watch(
    visible,
    async (val) => {
      val && (await calcContentHeight())
    },
    { immediate: true }
  )

  return {
    contentStyles
  }
}
