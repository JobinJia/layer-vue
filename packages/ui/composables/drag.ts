import { computed, type Ref, toRefs, unref } from 'vue'
import { useDraggable, useWindowScroll, useWindowSize } from '@vueuse/core'
import { type LayerProps } from '../components/Layer/props'
import { getDomWidthAndHeight, getStyle } from '../utils/dom'

export interface DragOptions {
  moveElRef: Ref<HTMLElement | null>
  layerMainRefEl: Ref<HTMLElement | null>
  left: Ref<number>
  top: Ref<number>
}

export function useDrag(props: LayerProps, { moveElRef, left, top, layerMainRefEl }: DragOptions) {
  const { moveOut, fixed } = toRefs(props)

  const initialValue = computed(() => {
    return {
      x: left.value,
      y: top.value
    }
  })

  const { x: wX, y: wY } = useWindowScroll()
  const { width: ww, height: wh } = useWindowSize()

  const state = {
    canDrag: true,
    offset: [0, 0]
  }

  useDraggable(moveElRef, {
    initialValue,
    preventDefault: true,
    stopPropagation: true,
    onStart(_, e) {
      const leftVal = getStyle(layerMainRefEl.value, 'left')
      const topVal = getStyle(layerMainRefEl.value, 'top')
      state.offset = [e.clientX - parseFloat(leftVal), e.clientY - parseFloat(topVal)]
    },
    onMove(_, e) {
      let X = e.clientX - state.offset[0]
      let Y = e.clientY - state.offset[1]

      const fixedVal = unref(fixed)

      const stX = fixedVal ? 0 : unref(wX)
      const stY = fixedVal ? 0 : unref(wY)
      // 实时 宽高
      const { domHeight, domWidth } = getDomWidthAndHeight(layerMainRefEl.value)

      // 控制元素不被拖出窗口外
      if (!unref(moveOut)) {
        const setRig = unref(ww) - domWidth + stX
        const setBot = unref(wh) - domHeight + stY
        X < stX && (X = stX)
        X > setRig && (X = setRig)
        Y < stY && (Y = stY)
        Y > setBot && (Y = setBot)
      }

      left.value = X
      top.value = Y
    }
  })
}
