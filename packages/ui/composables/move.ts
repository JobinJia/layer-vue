import { type LayerProps } from '../components/Layer/props'
import { type Ref } from 'vue'
import { unref, toRefs, watch } from 'vue'
import { until, useWindowScroll, useWindowSize } from '@vueuse/core'
import { getDomWidthAndHeight } from '../utils/dom'

export function useMove(
  props: LayerProps,
  layerInstance: Ref<HTMLElement | null>,
  moveRefEl: Ref<HTMLElement | null>,
  resizeRefEl: Ref<HTMLElement | null>,
  offset: { offsetTop: Ref<number>; offsetLeft: Ref<number>; width: Ref<number>; height: Ref<number> },
  emit: {
    (event: 'update:visible', visible: boolean): void
    (event: 'resizing'): void
    (event: 'move-end'): void
  }
) {
  const { fixed, move, moveOut, resize, visible } = toRefs(props)
  const dict: Record<string, any> = {}

  // window
  const { width: ww, height: wh } = useWindowSize()
  const { x, y } = useWindowScroll()
  // dom bounding
  // const { width: layWidth, height: layHeight } = useElementBounding(layerInstance)

  async function runMoveLogics() {
    await until(moveRefEl).not.toBeNull()
    await until(resizeRefEl).not.toBeNull()
    const moveElem = unref(moveRefEl)
    const resizeElem = unref(resizeRefEl)

    // move dom event
    moveElem.addEventListener('mousedown', (e) => {
      e.preventDefault()
      if (unref(move) !== false) {
        dict.moveStart = true
        dict.offset = [
          e.clientX - parseFloat(String(unref(offset.offsetLeft))),
          e.clientY - parseFloat(String(unref(offset.offsetTop)))
        ]
        // ready.moveElem.css('cursor', 'move').show();
      }
    })

    // resize dom event
    resizeElem.addEventListener('mousedown', (e) => {
      e.preventDefault()
      const { domWidth: layWidth, domHeight: layHeight } = getDomWidthAndHeight(unref(layerInstance))
      dict.resizeStart = true
      dict.offset = [e.clientX, e.clientY]
      dict.area = [unref(layWidth), unref(layHeight)]
      // ready.moveElem.css('cursor', 'se-resize').show();
    })

    // document event mousemove
    document.addEventListener('mousemove', (e) => {
      //拖拽移动
      if (dict.moveStart) {
        let X = e.clientX - dict.offset[0]
        let Y = e.clientY - dict.offset[1]
        const fixedVal = unref(fixed)

        e.preventDefault()

        dict.stX = fixedVal ? 0 : unref(x)
        dict.stY = fixedVal ? 0 : unref(y)

        //控制元素不被拖出窗口外
        if (!unref(moveOut)) {
          const { domWidth: layWidth, domHeight: layHeight } = getDomWidthAndHeight(unref(layerInstance))

          const setRig = unref(ww) - unref(layWidth) + dict.stX
          const setBot = unref(wh) - unref(layHeight) + dict.stY
          X < dict.stX && (X = dict.stX)
          X > setRig && (X = setRig)
          Y < dict.stY && (Y = dict.stY)
          Y > setBot && (Y = setBot)
        }

        // update offset value
        offset.offsetLeft.value = X
        offset.offsetTop.value = Y
      }
      // resize event
      if (unref(resize) && dict.resizeStart) {
        const X = e.clientX - dict.offset[0]
        const Y = e.clientY - dict.offset[1]

        e.preventDefault()

        offset.width.value = dict.area[0] + X
        // set height when Y is greater then 0
        offset.height.value = dict.area[1] + Y
        dict.isResize = true
        emit('resizing')
      }
    })

    // document event mouseup
    document.addEventListener('mouseup', (e) => {
      if (dict.moveStart) {
        delete dict.moveStart
        // ready.moveElem.hide();
        emit('move-end')
      }
      if (dict.resizeStart) {
        delete dict.resizeStart
        // ready.moveElem.hide();
      }
    })
  }

  watch(
    visible,
    async (val) => {
      if (val) {
        await runMoveLogics()
      }
    },
    { immediate: true }
  )
}
