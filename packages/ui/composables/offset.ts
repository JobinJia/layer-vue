import { type LayerProps } from '../components/Layer/props'
import { type Ref } from 'vue'
import { onMounted, ref, toRefs, unref } from 'vue'
import { isNumber } from 'lodash'
import { getDomWidthAndHeight } from '../utils/dom'
import { windowViewWidth, windowViewHeight } from '../utils/window'

export function useOffset(props: LayerProps, el: Ref<HTMLElement | null>) {
  const { offset } = toRefs(props)
  const offsetTopRef = ref(0)
  const offsetLeftRef = ref(0)
  onMounted(() => {
    if (!unref(el)) {
      return
    }
    const [domWidth, domHeight] = getDomWidthAndHeight(el.value)
    let offsetTop = (windowViewHeight - domHeight) / 2
    let offsetLeft = (windowViewWidth - domWidth) / 2
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
          offsetLeft = windowViewWidth - domWidth
          break
        case 'b':
          offsetTop = windowViewHeight - domHeight
          break
        case 'l':
          offsetLeft = 0
          break
        case 'lt':
          offsetLeft = 0
          offsetTop = 0
          break
        case 'lb':
          offsetTop = windowViewHeight - domHeight
          offsetLeft = 0
          break
        case 'rt':
          offsetTop = 0
          offsetLeft = windowViewWidth - domWidth
          break
        case 'rb':
          offsetTop = windowViewHeight - domHeight
          offsetLeft = windowViewWidth - domWidth
          break
        default:
          break
      }
    }
    offsetTopRef.value = offsetTop
    offsetLeftRef.value = offsetLeft
  })

  return {
    offsetTop: offsetTopRef,
    offsetLeft: offsetLeftRef
  }
}
