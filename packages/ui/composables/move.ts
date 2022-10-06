import { type LayerProps } from '../components/Layer/props'
import { type Ref } from 'vue'
import { onMounted, unref, toRefs } from 'vue'
import { getDomWidthAndHeight } from '../utils/dom'
import { getWindowScroll, windowViewHeight, windowViewWidth } from '../utils/window'

export function useMove(
  props: LayerProps,
  layerInstance: Ref<HTMLElement | null>,
  moveRefEl: Ref<HTMLElement | null>,
  resizeRefEl: Ref<HTMLElement | null>,
  offset: { offsetTop: Ref<number>; offsetLeft: Ref<number>; width: Ref<number>; height: Ref<number> },
  emit: {
    (event: 'close', visible: boolean): void
    (event: 'resizing'): void
    (event: 'move-end'): void
  }
) {
  const { fixed, move, moveOut, resize } = toRefs(props)
  const dict: Record<string, any> = {}

  function runMoveLogics() {
    const moveElem = unref(moveRefEl)
    const resizeElem = unref(resizeRefEl)
    if (moveElem === null || resizeElem === null) {
      return
    }
    // layer instance
    // const { domWidth, domHeight } = getDomWidthAndHeight(unref(layerInstance))
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
      const { domWidth, domHeight } = getDomWidthAndHeight(unref(layerInstance))
      dict.resizeStart = true
      dict.offset = [e.clientX, e.clientY]
      dict.area = [domWidth, domHeight]
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

        const { winScrollLeft, winScrollTop } = getWindowScroll()

        dict.stX = fixedVal ? 0 : winScrollLeft
        dict.stY = fixedVal ? 0 : winScrollTop

        //控制元素不被拖出窗口外
        if (!unref(moveOut)) {
          const { domWidth, domHeight } = getDomWidthAndHeight(unref(layerInstance))
          const setRig = windowViewWidth - domWidth + dict.stX
          const setBot = windowViewHeight - domHeight + dict.stY
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
  onMounted(() => {
    runMoveLogics()
  })
}
