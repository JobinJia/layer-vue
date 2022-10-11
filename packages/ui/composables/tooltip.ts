import { type LayerProps } from '../components/Layer/props'
import {type Ref, type CSSProperties, computed} from 'vue'
import { nextTick, onMounted, ref, toRefs, unref, watch } from 'vue'
import { isObject, isString } from 'lodash'
import {useElementBounding, useWindowScroll, useWindowSize} from '@vueuse/core'

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

  // windows
  const { width: ww, height: wh } = useWindowSize()
  const { x, y } = useWindowScroll()

  // follow ele
  const followEle = computed((): HTMLElement | null => {
    // follow 为undefined, 即外部没有传值时, 取ToolTips default slot
    if (unref(follow) === undefined) {
      if (unref(defaultSlotRefEl) === null) {
        return null
      }
      const wrapperDom = unref(defaultSlotRefEl).children
      return wrapperDom[0] as HTMLElement
    } else if(unref(follow) === null) {
      return null
    } else {
      if (isObject(unref(follow))) {
        return unref(follow) as HTMLElement
      } else {
        const selector = unref(follow) as string
        return document.querySelector(selector)
      }
    }
  })

  // dom width
  const { width: tw , height: th }  = useElementBounding(toolTipRefEl)
  const { width: fw , height: fh, left: fl, top: ft }  = useElementBounding(followEle)

  // const followInstance = ref<HTMLElement | null>(null)

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
        console.log(goal.left, layArea[0])
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
    // if (unref(toolTipRefEl) === null) {
    //   return
    // }
    // const wrapperDom = unref(defaultSlotRefEl).children
    // let useDom = wrapperDom[0] as HTMLElement
    // const followDom = unref(follow)
    // if (followDom !== undefined) {
    //   if (isObject(followDom)) {
    //     useDom = followDom
    //   } else {
    //     // 如果是 HtmlTagName 或 选择器 只会用第一个
    //     useDom = document.querySelector(followDom)
    //   }
    // }
    // followInstance.value = useDom

    // const toolTipDom = unref(toolTipRefEl)
    // const layArea = [toolTipDom.offsetWidth, toolTipDom.offsetHeight]
    // const { domWidth, domHeight } = getDomWidthAndHeight(useDom)
    const layArea = [tw.value, th.value]

    const goal = {
      width: fw.value,
      height: fh.value,
      top: ft.value,
      left: fl.value,
      tipLeft: 0,
      tipTop: 0
    }

    // 方位
    const tipsVal = unref(tips)
    const guide = isString(tipsVal) ? tipsVal : tipsVal[0]
    const where = getTipDirection(goal, guide, layArea)
    where[guide]()

    /* 8*2为小三角形占据的空间 */
    // const { winScrollLeft, winScrollTop } = getWindowScroll()
    switch (guide) {
      case 't':
        goal.top - (y.value + layArea[1] + 8 * 2) < 0 && where['b']() //goal.where[2]();
        break
      case 'r':
        ww.value - (goal.left + goal.width + layArea[0] + 8 * 2) > 0 || where['l']()
        break
      case 'b':
        goal.top - y.value + goal.height + layArea[1] + 8 * 2 - wh.value > 0 && where['t']()
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
      left: goal.tipLeft - (unref(fixed) ? x.value : 0) + 'px',
      top: goal.tipTop - (unref(fixed) ? y.value : 0) + 'px'
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
    tipsGStyles,
    tipsGClasses,
    tipsContentStyle,
    tipsStyles
  }
}
