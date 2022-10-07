import { type LayerProps } from '../components/Layer/props'
import { type CSSProperties, nextTick, type Ref } from 'vue'
import { ref, toRefs, unref, watch } from 'vue'
import { getDomPosition, getDomWidthAndHeight } from '../utils/dom'
import { getWindowScroll, windowViewHeight, windowViewWidth } from '../utils/window'
import { setShade } from './shade'

export type LayerCache = {
  width: number
  height: number
  left: number
  top: number
}

/**
 * 动画套层
 * @param dynamicModalStyles
 * @param fn
 * @param animTime 动画时间-该时间之后, 重置动画效效,保证移动时没有动画效果
 */
async function transitionWrapper (dynamicModalStyles: Ref<CSSProperties>, fn: () => void, animTime = 0.5) {
  dynamicModalStyles.value = {
    transition: 'all 0.5s',
    overflow: 'hidden'
  }
  await nextTick()
  fn()
  setTimeout(() => {
    dynamicModalStyles.value = {
      transition: 'unset',
      overflow: 'auto'
    }
  }, animTime * 1000)
}

export function useMinMax(
  props: LayerProps,
  dynamicModalStyles: Ref<CSSProperties>,
  nature: { offsetTop: Ref<number>; offsetLeft: Ref<number>; width: Ref<number>; height: Ref<number> },
  layerModalRefEl: Ref<HTMLElement | null>,
  titleRefEl: Ref<HTMLElement | null>
) {
  const { type, maxmin, minStack, fixed } = toRefs(props)

  const openMaxMin = ref<boolean>(false)
  const showMinIcon = ref<boolean>(true)
  const showMaxIcon = ref<boolean>(true)
  const minIconClasses = ref<string[]>(['layui-layer-max'])
  const modalClasses = ref<string>('layui-layer-dialog')

  let cache: LayerCache | null = null
  let isMin: boolean = false
  let isMax: boolean = false

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
        modalClasses.value = 'layui-layer-page'
      } else {
        openMaxMin.value = unref(maxmin)
        modalClasses.value = unref(maxmin) ? 'layui-layer-page' : 'layui-layer-dialog'
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
    cache = {
      width,
      height,
      left,
      top
    }
  }

  function clearCache(): LayerCache {
    const cacheVal = unref(cache)
    cache = null
    return cacheVal
  }

  async function min() {
    isMin = true
    setShade(false)
    setCache()
    minIconStyles.value = {
      display: 'none'
    }
    await transitionWrapper(dynamicModalStyles, async () => {
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
      await nextTick()
    })
  }

  function restore() {
    const { width, height, left, top } = clearCache()
    nature.width.value = width
    nature.height.value = height
    nature.offsetTop.value = top
    nature.offsetLeft.value = left

    showMinIcon.value = true
    isMin = false
    isMax = false

    minIconClasses.value.pop()
  }

  async function max() {
    setShade(true)

    await transitionWrapper(dynamicModalStyles, async () => {
      if (isMin || isMax) {
        restore()
      } else {
        setCache()
        const { winScrollLeft: left, winScrollTop: top } = getWindowScroll()
        nature.width.value = windowViewWidth
        nature.height.value = windowViewHeight
        nature.offsetTop.value = unref(fixed) ? 0 : left
        nature.offsetLeft.value = unref(fixed) ? 0 : top

        showMinIcon.value = false
        minIconClasses.value.push('layui-layer-maxmin')

        isMax = true
      }
      await nextTick()
    })
  }

  return {
    modalClasses,
    openMaxMin,
    showMinIcon,
    minIconClasses,
    showMaxIcon,
    min,
    max
  }
}
