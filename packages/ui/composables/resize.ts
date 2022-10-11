import { computed, Ref, toRefs, unref } from 'vue'
import { useDraggable } from '@vueuse/core'
import {getDomWidthAndHeight} from "../utils/dom";
import {LayerProps} from "../components/Layer/props";

export interface ResizeOptions {
  layerResizeRefEl: Ref<HTMLElement | null>
  layerMainRefEl: Ref<HTMLElement | null>
  width: Ref<number>
  height: Ref<number>
}

export function useResize(props: LayerProps, { layerResizeRefEl, layerMainRefEl, height, width }: ResizeOptions) {
  const { resize } = toRefs(props)
  const state = {
    offset: [0, 0],
    area: [0, 0]
  }

  const initialValue = computed(() => ({
    x: props.area[0],
    y: props.area[1]
  }))

  useDraggable(layerResizeRefEl, {
    initialValue,
    preventDefault: true,
    stopPropagation: true,
    onStart(_, e) {
      state.offset = [e.clientX, e.clientY]
      const { domWidth, domHeight } = getDomWidthAndHeight(layerMainRefEl.value)
      state.area = [domWidth, domHeight]
    },
    onMove(_, e) {
      if (unref(resize)) {
        const X = e.clientX - state.offset[0]
        const Y = e.clientY - state.offset[1]
        width.value = X + state.area[0]
        height.value = Y + state.area[1]
      }
    }
  })
}
