import { type LayerProps } from '../components/Layer/props'
import { type Ref, type CSSProperties } from 'vue'
import { nextTick, onMounted, ref, toRefs, unref, watch } from 'vue'
import { isObject, isString } from 'lodash'
import { getDomWidthAndHeight } from '../utils/dom'
import { getWindowScroll, windowViewHeight, windowViewWidth } from '../utils/window'

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
  const { visible, follow, tips, closeBtn, fixed } = toRefs(props)

  const followInstance = ref<HTMLElement | null>(null)

  const tipsGStyles = ref<CSSProperties>({})
  const tipsGClasses = ref<string>('')
  const tipsContentStyle = ref<CSSProperties>({})
  const tipsStyles = ref<CSSProperties>({})

  //
  function autoLeft(goal, layArea) {
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

  // 辨别方位
  function getTipDirection(goal, guide, layArea) {
    const tipsVal = unref(tips)
    const tipBorderColor = tipsVal[1]
    const prefix = 'layui-layer-Tips'
    return {
      t: () => {
        autoLeft(goal, layArea)
        goal.tipTop = goal.top - layArea[1] - 10
        tipsGClasses.value = `${prefix}T`
        tipsGStyles.value = {
          borderRightColor: tipBorderColor
        }
      },
      r: () => {
        goal.tipLeft = goal.left + goal.width + 10
        goal.tipTop = goal.top
        tipsGClasses.value = `${prefix}R`
        tipsGStyles.value = {
          borderBottomColor: tipBorderColor
        }
      },
      b: () => {
        autoLeft(goal, layArea)
        goal.tipTop = goal.top + goal.height + 10
        tipsGClasses.value = `${prefix}B`
        tipsGStyles.value = {
          borderRightColor: tipBorderColor
        }
      },
      l: () => {
        goal.tipLeft = goal.left - layArea[0] - 10
        goal.tipTop = goal.top
        tipsGClasses.value = `${prefix}L`
        tipsGStyles.value = {
          borderBottomColor: tipBorderColor
        }
      }
    }
  }

  function getFollowDom() {
    if (unref(toolTipRefEl) === null) {
      return
    }
    const wrapperDom = unref(defaultSlotRefEl).children
    let useDom = wrapperDom[0] as HTMLElement
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
      tipLeft: 0,
      tipTop: 0
    }

    // 方位
    const tipsVal = unref(tips)
    const guide = isString(tipsVal) ? tipsVal : tipsVal[0]
    const where = getTipDirection(goal, guide, layArea)
    where[guide]()

    /* 8*2为小三角形占据的空间 */
    const { winScrollLeft, winScrollTop } = getWindowScroll()
    switch (guide) {
      case 't':
        goal.top - (winScrollTop + layArea[1] + 8 * 2) < 0 && where['b']() //goal.where[2]();
        break
      case 'r':
        windowViewWidth - (goal.left + goal.width + layArea[0] + 8 * 2) > 0 || where['l']()
        break
      case 'b':
        goal.top - winScrollTop + goal.height + layArea[1] + 8 * 2 - windowViewHeight > 0 && where['t']()
        break
      case 'l':
        layArea[0] + 8 * 2 - goal.left > 0 && where['r']()
        break
      default:
        break
    }

    // layer content style
    tipsContentStyle.value = {
      backgroundColor: tipsVal[1],
      paddingRight: unref(closeBtn) === false ? '' : '30px'
    }

    tipsStyles.value = {
      left: goal.tipLeft - (unref(fixed) ? winScrollLeft : 0) + 'px',
      top: goal.tipTop - (unref(fixed) ? winScrollTop : 0) + 'px'
    }
  }

  onMounted(() => {
    if (unref(visible)) {
      getFollowDom()
    }
  })

  watch(visible, async (open) => {
    if (open) {
      await nextTick()
      getFollowDom()
    }
  })

  return {
    followInstance,
    tipsGStyles,
    tipsGClasses,
    tipsContentStyle,
    tipsStyles
  }
}
