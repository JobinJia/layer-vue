import { computed, type CSSProperties, type Ref, type SetupContext, unref } from 'vue'
import { isNumber } from 'lodash'
import { type LayerProps } from '../components/Layer/props'
import { type LayerGlobalCacheRecord } from './layerCache'

export interface UseStyleOptions {
  globalCacheData: Ref<LayerGlobalCacheRecord>
  slots: SetupContext['slots']
  width: Ref<number>
  height: Ref<number>
  left: Ref<number>
  top: Ref<number>
  beforeMaxMinStyles: Ref<CSSProperties>
}

export function useStyles(
  props: LayerProps,
  { globalCacheData, slots, width, height, left, top, beforeMaxMinStyles }: UseStyleOptions
) {
  // 标题
  const showTitle = computed(() => {
    return props.title || Object.keys(slots).includes('title')
  })

  const titleStyles = computed(() => {
    return {
      cursor: props.move ? 'move' : 'unset'
    }
  })

  // 主体
  const layerClasses = computed(() => {
    return [
      'layui-layer',
      `layui-layer-${props.type}`,
      {
        'layui-layer-border': (props.type == 'dialog' || props.type == 'iframe') && !props.shade
      }
    ]
  })

  const layerStyles = computed((): CSSProperties => {
    return {
      zIndex: unref(globalCacheData).zIndex,
      width: `${width.value}px`,
      height: `${height.value}px`,
      left: `${left.value}px`,
      top: `${top.value}px`,
      position: props.fixed ? 'fixed' : 'absolute',
      ...unref(beforeMaxMinStyles)
    }
  })

  // is max
  const isMax = computed(() => {
    return props.maxmin && (props.type === 'page' || props.type === 'iframe')
  })

  // 内容部分
  const contentClasses = computed(() => {
    return [
      'layui-layer-content',
      {
        'layui-layer-padding': props.type == 'dialog' && props.icon !== -1,
        [`layui-layer-loading${props.icon}`]: props.type === 'loading'
      }
    ]
  })

  // 右上角关闭图标
  const showIcon = computed(() => {
    return props.icon !== -1
  })
  const iconClasses = computed(() => {
    return [
      'layui-layer-ico',
      {
        [`layui-layer-ico${props.icon}`]: props.type === 'dialog' && props.icon !== -1
      }
    ]
  })

  // 右上角关闭按钮
  const closeBtnClasses = computed(() => {
    const showCloseBtn = unref(showTitle) && isNumber(props.closeBtn)
    const closeBtnSuffix = showCloseBtn ? props.closeBtn : props.type === 'tips' ? '1' : '2'

    return [
      'layui-layer-ico',
      {
        'layui-layer-close': isNumber(props.closeBtn),
        [`layui-layer-close${closeBtnSuffix}`]: showCloseBtn
      }
    ]
  })

  // 最大化图标
  const maxIconClasses = computed(() => {
    const {
      maxmin: { isMax, isMin }
    } = unref(globalCacheData)
    return [
      'layui-layer-ico',
      'layui-layer-max',
      {
        'layui-layer-maxmin': isMax || isMin
      }
    ]
  })

  // footer
  const footerBtnClasses = computed(() => {
    return [
      'layui-layer-btn'
      // {
      //   [`layui-layer-btn-${props.btnAlign}`]:
      // }
    ]
  })

  // resize

  return {
    layerStyles,
    layerClasses,
    showTitle,
    titleStyles,
    contentClasses,
    isMax,
    showIcon,
    iconClasses,
    maxIconClasses,
    closeBtnClasses,
    footerBtnClasses
  }
}
