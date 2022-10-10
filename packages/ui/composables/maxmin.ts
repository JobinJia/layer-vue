import { type LayerProps } from '../components/Layer/props'
import { type CSSProperties, type Ref } from 'vue'
import { ref, toRefs, unref, watch, nextTick } from 'vue'
import { setShade } from './shade'
import { until, useWindowScroll, useWindowSize } from '@vueuse/core'
import { getDomPosition, getDomWidthAndHeight, getStyle } from '../utils/dom'
import { mergeRefObject } from '../utils/reactivity'

export type MaxMinPositionCache = {
  width: number
  height: number
  left: number
  top: number
  position: CSSProperties['position']
  overflow: CSSProperties['overflow']
  transition: CSSProperties['transition']
}

export type MaxMinCache = {
  position: MaxMinPositionCache | null
  isMax: boolean
  isMin: boolean
}

export function useMinMax(
  props: LayerProps,
  dynamicModalStyles: Ref<CSSProperties>,
  nature: { offsetTop: Ref<number>; offsetLeft: Ref<number>; width: Ref<number>; height: Ref<number> },
  layerModalRefEl: Ref<HTMLElement | null>,
  titleRefEl: Ref<HTMLElement | null>
) {
  const { type, maxmin, minStack, visible } = toRefs(props)

  // windows
  const { width: ww, height: wh } = useWindowSize()
  const { x, y } = useWindowScroll()

  const openMaxMin = ref<boolean>(false)
  const showMinIcon = ref<boolean>(true)
  const showMaxIcon = ref<boolean>(true)
  const minIconClasses = ref<string[]>(['layui-layer-max'])
  const modalClasses = ref<string>('layui-layer-dialog')

  const minMaxCache = ref<MaxMinCache>({
    position: null,
    isMax: false,
    isMin: false
  })

  let minIndex = 0
  const settings = {
    width: 180,
    height: 0, //titHeight
    position: 'fixed',
    overflow: 'hidden',
    transition: 'all 0.5s',
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

  async function beforeActions() {
    mergeRefObject(dynamicModalStyles, {
      position: settings.position,
      transition: settings.transition,
      overflow: settings.overflow
    })
    await nextTick()
  }

  function clearTransition () {
    // 动画时间执行完毕业, 移掉transition, 拖拽不需要动画
    return new Promise((resolve) => {
      setTimeout(() => {
        mergeRefObject(dynamicModalStyles, {
          transition: unref(minMaxCache).position.transition
        })
        resolve(true)
      }, 0.5)
    })
  }

  async function setCache() {
    await until(layerModalRefEl).not.toBeNull()
    const modalEle = unref(layerModalRefEl)
    const { domWidth: modalWidth, domHeight: modalHeight } = getDomWidthAndHeight(modalEle)
    const { left: modalLeft, top: modalTop } = getDomPosition(modalEle)
    const position = getStyle(modalEle, 'position')
    const overflow = getStyle(modalEle, 'overflow')
    const transition = getStyle(modalEle, 'transition')
    minMaxCache.value = {
      ...unref(minMaxCache.value),
      ...{
        position: {
          width: unref(modalWidth),
          height: unref(modalHeight),
          left: unref(modalLeft),
          top: unref(modalTop),
          position,
          overflow,
          transition
        }
      }
    }
  }

  function clearCache() {
    minMaxCache.value = {
      position: null,
      isMax: false,
      isMin: false
    }
  }

  async function min() {
    minMaxCache.value.isMin = true
    setShade(false)
    await setCache()
    minIconStyles.value = {
      display: 'none'
    }
    const { domHeight: titleHeight } = getDomWidthAndHeight(unref(titleRefEl))

    settings.height = unref(titleHeight)
    if (unref(minStack)) {
      settings.top = wh.value - unref(titleHeight)
      minIndex++
    }
    // dom 位置变化时, 先变形, 再移动
    await beforeActions()

    nature.height.value = settings.height
    nature.width.value = settings.width
    nature.offsetTop.value = settings.top
    nature.offsetLeft.value = settings.left

    minIconClasses.value.push('layui-layer-maxmin')
    showMinIcon.value = false

    await nextTick()

    await clearTransition()
  }

  async function restore() {
    setShade(true)

    showMinIcon.value = true
    minIconClasses.value.pop()

    if (unref(minMaxCache).position) {
      const {
        position: { width, height, left, top }
      } = unref(minMaxCache)

      await beforeActions()

      console.log('hhh => ', height)
      nature.offsetLeft.value = left
      nature.offsetTop.value = top
      nature.width.value = width
      nature.height.value = height

      await nextTick()

      await clearTransition()
    }
    await clearCache()
  }

  async function max() {
    if (unref(minMaxCache).isMax || unref(minMaxCache).isMin) {
      await restore()
    } else {
      setShade(false)
      minIconStyles.value = {
        display: 'none'
      }
      showMinIcon.value = false
      minMaxCache.value.isMax = true
      minIconClasses.value.push('layui-layer-maxmin')
      await setCache()

      await beforeActions()

      const isFixed = unref(minMaxCache).position.position === 'fixed'

      nature.width.value = ww.value
      nature.height.value = wh.value
      nature.offsetTop.value = isFixed ? 0 : x.value
      nature.offsetLeft.value = isFixed ? 0 : y.value

      await nextTick()

      await clearTransition()
    }
  }

  watch(visible, async (value) => {
    const { isMax, isMin } = unref(minMaxCache)
    // 关闭时, 还原
    if (value === false && (isMin || isMax)) {
      await restore()
    }
  })

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
