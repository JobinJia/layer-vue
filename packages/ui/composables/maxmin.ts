import { computed, CSSProperties, nextTick, Ref, ref, ShallowRef, toRefs, unref, watch } from 'vue'
import { promiseTimeout, useWindowScroll, useWindowSize } from '@vueuse/core'
import { LayerGlobalCacheRecord } from './global-cache'
import {LayerProps} from "../components/Layer/props";
import {getDomPosition, getDomWidthAndHeight} from "../utils/dom";

export interface MaxMinOptions {
  layerMainRefEl: Ref<HTMLElement | null>
  layerTitleRefEl: Ref<HTMLElement | null>
  currentVmCache: ShallowRef<LayerGlobalCacheRecord>
  updateGlobalCache: (payload: Partial<LayerGlobalCacheRecord>) => void
  width: Ref<number>
  height: Ref<number>
  left: Ref<number>
  top: Ref<number>
  showShade: Ref<boolean>
}

export interface MinSettings {
  height: number
  width: number
  position: CSSProperties['position']
  left: number
  top: number
}

const MIN_SETTINGS: MinSettings = {
  width: 180,
  height: 51, // title height
  left: 0,
  top: 0, // window height - title height
  position: 'fixed'
}

async function setAnimation(style: Ref<CSSProperties>, payload?: CSSProperties) {
  Object.assign(
    style.value,
    {
      transition: 'all 0.5s',
      overflow: 'hidden'
    } as CSSProperties,
    payload
  )
  await nextTick()
}

async function delAnimation(style: Ref<CSSProperties>, payload?: CSSProperties) {
  Object.assign(
    style.value,
    {
      transition: 'unset'
    } as CSSProperties,
    payload
  )
  await nextTick
}

export function useMaxMin(
  props: LayerProps,
  {
    layerMainRefEl,
    layerTitleRefEl,
    width,
    height,
    left,
    top,
    currentVmCache,
    updateGlobalCache,
    showShade
  }: MaxMinOptions
) {
  const { maxmin, fixed, visible } = toRefs(props)

  // window
  const { width: windowWidth, height: windowHeight } = useWindowSize({ listenOrientation: true })
  const { x: windowLeft, y: windowTop } = useWindowScroll()

  const beforeMaxMinStyles = ref<CSSProperties>({})

  const positionCache = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    position: 'fixed'
  }

  function setPositionCache() {
    const { domWidth, domHeight } = getDomWidthAndHeight(layerMainRefEl.value)
    const { left, top } = getDomPosition(layerMainRefEl.value)

    Object.assign(positionCache, {
      width: domWidth,
      height: domHeight,
      left,
      top,
      position: unref(fixed) ? 'fixed' : 'absolute'
    } as CSSProperties)
  }

  async function minimize() {
    if (!unref(maxmin)) return
    setPositionCache()
    showShade.value = false
    // 全局通知
    updateGlobalCache({
      maxmin: {
        isMin: true,
        isMax: false
      }
    })
    // 添加最小化时的动画
    await setAnimation(beforeMaxMinStyles)
    // 执行最小化样式变化
    const { domHeight } = getDomWidthAndHeight(layerTitleRefEl.value)
    width.value = MIN_SETTINGS.width
    height.value = domHeight
    left.value = MIN_SETTINGS.left
    top.value = unref(windowHeight) - domHeight
    // 动画时间为.5s. 这个时间执行完毕后. 移除掉动画样式
    await promiseTimeout(0.5 * 1000)
    await delAnimation(beforeMaxMinStyles)
  }

  async function restore() {
    showShade.value = true
    // 全局通知
    updateGlobalCache({
      maxmin: {
        isMin: false,
        isMax: false
      }
    })
    // 添加样式变画前的动画
    await setAnimation(beforeMaxMinStyles)
    // 还原样式变化
    width.value = positionCache.width
    height.value = positionCache.height
    left.value = positionCache.left
    top.value = positionCache.top
    // 动画时间为.5s. 这个时间执行完毕后. 移除掉动画样式
    await promiseTimeout(0.5 * 1000)
    await delAnimation(beforeMaxMinStyles, {
      overflow: 'visible'
    })
  }

  async function full(needCache = true) {
    showShade.value = false
    // 缓存当前
    needCache && setPositionCache()
    // 全局通知
    updateGlobalCache({
      maxmin: {
        isMin: false,
        isMax: true
      }
    })
    // 添加样式变画前的动画
    await setAnimation(beforeMaxMinStyles)
    // 铺满全屏样式变化
    width.value = unref(windowWidth)
    height.value = unref(windowHeight)
    left.value = unref(fixed) ? 0 : unref(windowLeft)
    top.value = unref(fixed) ? 0 : unref(windowTop)
    // 动画时间为.5s. 这个时间执行完毕后. 移除掉动画样式
    await promiseTimeout(0.5 * 1000)
    // 移除动画
    await delAnimation(beforeMaxMinStyles, {
      overflow: 'visible'
    })
  }

  async function restoreOrFull() {
    const {
      maxmin: { isMin, isMax }
    } = unref(currentVmCache)
    if (isMin || isMax) {
      await restore()
    } else {
      await full()
    }
  }

  // 关闭时需要重置
  watch(visible, async (val) => {
    if (!val) {
      const {
        maxmin: { isMax, isMin }
      } = unref(currentVmCache)
      if (isMax || isMin) {
        await restore()
      }
    }
  })
  // 如果最大化时, windows窗口变化, 则最大化也会变化
  watch(
    () => [windowWidth.value, windowHeight.value],
    async () => {
      const {
        maxmin: { isMax }
      } = unref(currentVmCache)
      if (unref(visible) && isMax) {
        await full(false)
      }
    }
  )

  return {
    beforeMaxMinStyles,
    minimize,
    restoreOrFull
  }
}
