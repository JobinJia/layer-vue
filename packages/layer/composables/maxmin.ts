import type { CSSProperties, Ref } from 'vue'
import type { LayerProps } from '../components/Layer/props'
import type { LayerGlobalCacheRecord } from './layerCache'

import { nextTick, ref, toRefs, unref, watch } from 'vue'
import { promiseTimeout, useWindowScroll, useWindowSize } from '@vueuse/core'
import { getDomPosition, getDomWidthAndHeight } from '../utils/dom'
import { LayerCache } from './layerCache'

export interface MaxMinOptions {
  layerMainRefEl: Ref<HTMLElement | null>
  layerTitleRefEl: Ref<HTMLElement | null>
  globalCacheData: Ref<LayerGlobalCacheRecord>
  globalCacheIns: Ref<LayerCache>
  updateGlobalCache: (payload: Partial<LayerGlobalCacheRecord>) => void
  width: Ref<number>
  height: Ref<number>
  left: Ref<number>
  top: Ref<number>
  showShade: Ref<boolean>
}

export interface MaxMinReturn {
  beforeMaxMinStyles: Ref<CSSProperties>
  minimize: () => Promise<void>
  restoreOrFull: () => Promise<void>
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
    globalCacheData,
    globalCacheIns,
    updateGlobalCache,
    showShade
  }: MaxMinOptions
): MaxMinReturn {
  const { maxmin, fixed, visible, minStack } = toRefs(props)

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
    // ????????????
    updateGlobalCache({
      maxmin: {
        isMin: true,
        isMax: false
      }
    })
    await nextTick()
    // ???????????????????????????
    await setAnimation(beforeMaxMinStyles)
    // ???????????????????????????
    const { domHeight } = getDomWidthAndHeight(layerTitleRefEl.value)
    width.value = MIN_SETTINGS.width
    height.value = domHeight
    top.value = unref(windowHeight) - domHeight
    if (unref(minStack)) {
      left.value = MIN_SETTINGS.left
    } else {
      // ???????????????
      const { minStackCount } = unref(globalCacheIns)
      left.value = 181 * minStackCount
      // ?????????????????????
      globalCacheIns.value.minStackCount++
    }
    // ???????????????.5s. ???????????????????????????. ?????????????????????
    await promiseTimeout(0.5 * 1000)
    await delAnimation(beforeMaxMinStyles)
  }

  async function restore() {
    showShade.value = true
    // ??????????????????????????????
    await setAnimation(beforeMaxMinStyles)
    // ??????????????????
    width.value = positionCache.width
    height.value = positionCache.height
    left.value = positionCache.left
    top.value = positionCache.top
    // ???????????????.5s. ???????????????????????????. ?????????????????????
    await promiseTimeout(0.5 * 1000)
    await delAnimation(beforeMaxMinStyles, {
      overflow: 'visible'
    })
    // ?????????????????????, ?????????????????????, ???????????????-1
    const {
      maxmin: { isMin }
    } = unref(globalCacheData)
    if (!unref(minStack) && isMin) {
      globalCacheIns.value.minStackCount--
    }
    // ??????????????????
    updateGlobalCache({
      maxmin: {
        isMin: false,
        isMax: false
      }
    })
  }

  async function full(needCache = true) {
    showShade.value = false
    // ????????????
    needCache && setPositionCache()
    // ????????????
    updateGlobalCache({
      maxmin: {
        isMin: false,
        isMax: true
      }
    })
    // ??????????????????????????????
    await setAnimation(beforeMaxMinStyles)
    // ????????????????????????
    width.value = unref(windowWidth)
    height.value = unref(windowHeight)
    left.value = unref(fixed) ? 0 : unref(windowLeft)
    top.value = unref(fixed) ? 0 : unref(windowTop)
    // ???????????????.5s. ???????????????????????????. ?????????????????????
    await promiseTimeout(0.5 * 1000)
    // ????????????
    await delAnimation(beforeMaxMinStyles, {
      overflow: 'visible'
    })
  }

  async function restoreOrFull() {
    const {
      maxmin: { isMin, isMax }
    } = unref(globalCacheData)
    if (isMin || isMax) {
      await restore()
    } else {
      await full()
    }
  }

  // ?????????????????????
  watch(visible, async (val) => {
    if (!val) {
      // ????????????
      const {
        maxmin: { isMax, isMin }
      } = unref(globalCacheData)
      if (isMax || isMin) {
        await restore()
      }
    }
  })
  // ??????????????????, windows????????????, ????????????????????????
  watch(
    () => [windowWidth.value, windowHeight.value],
    async () => {
      const {
        maxmin: { isMax }
      } = unref(globalCacheData)
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
