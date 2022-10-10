import {LayerProps} from "../../../Layer/props";
import {computed, Ref, toRefs, unref, watch, watchEffect} from "vue";
import {until, useDraggable, useWindowScroll, useWindowSize} from "@vueuse/core";
import {getDomWidthAndHeight} from "../../../../utils/dom";

export interface DragOptions {
  moveElRef: Ref<HTMLElement | null>
  layerMainRefEl: Ref<HTMLElement | null>
  la: Ref<number>
  height: Ref<number>
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

  useDraggable(moveElRef, {
    initialValue,
    preventDefault: true,
    stopPropagation: true,
    onMove({x, y}, e) {
      let X = x
      let Y = y
      const fixedVal = unref(fixed)
      e.preventDefault()

      const stX = fixedVal ? 0 : unref(wX)
      const stY = fixedVal ? 0 : unref(wY)
      // 实时 宽高
      const { domHeight, domWidth } = getDomWidthAndHeight(layerMainRefEl.value)

      //控制元素不被拖出窗口外
      if (!unref(moveOut)) {
        // 最右边会触发宽度的变化
        console.log(X, ww.value, domWidth, stX)
        const setRig = unref(ww) - unref(domWidth) + stX
        const setBot = unref(wh) - unref(domHeight) + stY
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
