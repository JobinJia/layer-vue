import { type LayerProps } from '../components/Layer/props'
import { CSSProperties, onMounted, Ref, ref, toRefs, unref } from 'vue'
import {isObject, isString} from 'lodash'
import { getDomWidthAndHeight } from '../utils/dom'

/**
 * follow 一般有三种情况:
 * 1. 默认为 LayToolTip的default slot
 * 2. 可以是一个Dom Element (refEl)
 * 3. 极端情况下, 可能需要用到选择器来获取Dom元素
 * 优先级: 1 > 2 = 3
 */
export function useToolTip(
  props: LayerProps,
  toolTipRefEl: Ref<HTMLElement | null>,
  defaultSlotRefEl: Ref<HTMLElement | null>
) {
  const { follow, tips } = toRefs(props)

  const followInstance = ref<HTMLElement | null>(null)
  const whereClasses = ref<CSSProperties>({})
  const tipsGStyles = ref<CSSProperties>({})
  const tipsGClasses = ref<string>('')

  function getFollowDom() {
    if (unref(toolTipRefEl)) {
      return
    }
    let useDom = unref(defaultSlotRefEl)
    const followDom = unref(follow)
    if (followDom !== undefined) {
      if (isObject(followDom)) {
        useDom = followDom
      } else {
        // 如果是 HtmlTagName 或 选择器 只会用第一个
        useDom = document.querySelector(followDom)
      }
    }
    followInstance.value = useDom

    const toolTipDom = unref(toolTipRefEl)
    const layArea = [toolTipDom.offsetWidth, toolTipDom.offsetHeight]
    const { domWidth, domHeight } = getDomWidthAndHeight(useDom)

    const goal = {
      width: domWidth,
      height: domHeight,
      top: useDom.offsetTop,
      left: useDom.offsetLeft,
      tipLeft: 0
    }
    const tipsG = toolTipRefEl.value.querySelector('.layui-layer-TipsG')
    function autoLeft() {
      if (goal.left + layArea[0] - window.innerWidth > 0) {
        goal.tipLeft = goal.left + goal.width - layArea[0]
        tipsGStyles.value = {
          right: '12px',
          left: 'auto'
        }
      } else {
        goal.tipLeft = goal.left
      }
    }
    // 方位
    const tipsVal = unref(tips)
    const guide = isString(tipsVal) ? tipsVal : tipsVal[0]
  }

  onMounted(getFollowDom)

  return {
    followInstance
  }
}
