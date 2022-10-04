import { type ExtractPropTypes, PropType } from 'vue'

// type中移除page 如果要使用 可以 在default slot中 div v-html="xxx
// 原来的1 = page 现更正为message
// export type LayerType = 0 | 1 | 2 | 3 | 4 // | 'dialog(modal)' | 'message' | 'iframe' | 'loading' | 'tips';
export type LayerType = 'dialog' | 'page' | 'iframe' | 'loading' | 'tips' | 'message'
export type LayerTransitionType = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Area = number | [number, number] | 'auto'
export type Offset =
  | number
  | [number, number] // 去掉px, 由内部实现
  | 't'
  | 'r'
  | 'b'
  | 'l'
  | 'lt'
  | 'lb'
  | 'rt'
  | 'rb'
  | 'auto'
export type Shade = false | string | [number, string] // todo: 可以优化，单string应该为颜色值。数组为 [透明度，颜色]
export type AnimationType = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6

export type TipsDirection = 't' | 'r' | 'b' | 'l'
export type Tips = TipsDirection | [TipsDirection, string] // todo: [TipsDirection, string] string 为颜色值
export type Move = 'title' | 'content' | 'footer' | boolean
export type Follow = HTMLElement | keyof HTMLElementTagNameMap
export type BtnType = false | 1 | 2

export type LayerProps = ExtractPropTypes<typeof layerProps>

export const layerProps = {
  visible: {
    type: Boolean as PropType<boolean>
  },
  /**
   * layer提供了5种层类型。
   * 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。
   * 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
   * 'dialog' | 'page' | 'iframe' | 'loading' | 'tips' | 'message'
   */
  type: {
    type: String as PropType<LayerType>,
    default: 'dialog'
  },
  /**
   * 标题
   * 类型：String，默认：'信息'
   */
  title: {
    type: String,
    default: '信息'
  },
  /**
   * 内容
   */
  content: {
    type: [String] as PropType<string>
  },
  /**
   * 宽高
   * 类型：String/Array，默认：'auto'
   * 在默认状态下，layer是宽高都自适应的，但当你只想定义宽度时，你可以area: '500px'，高度仍然是自适应的。当你宽高都要定义时，你可以area: ['500px', '300px']
   */
  area: {
    type: [Number, Array, String] as PropType<Area>,
    default: 'auto'
  },
  /**
   * 坐标
   * 类型：String/Array，默认：垂直水平居中
   * offset: 'auto'	默认坐标，即垂直水平居中
   * offset: '100px'	只定义top坐标，水平保持居中
   * offset: ['100px', '50px']	同时定义top、left坐标
   * offset: 't'	快捷设置顶部坐标
   * offset: 'r'	快捷设置右边缘坐标
   * offset: 'b'	快捷设置底部坐标
   * offset: 'l'	快捷设置左边缘坐标
   * offset: 'lt'	快捷设置左上角
   * offset: 'lb'	快捷设置左下角
   * offset: 'rt'	快捷设置右上角
   * offset: 'rb'	快捷设置右下角
   */
  offset: {
    type: [String, Number, Array] as PropType<Offset>,
    default: 'auto'
  },
  /**
   * 遮罩
   * 类型：String/Array/Boolean，默认：0.3
   * 即弹层外区域。默认是0.3透明度的黑色背景（'#000'）。如果你想定义别的颜色，可以shade: [0.8, '#393D49']；如果你不想显示遮罩，可以shade: 0
   */
  shade: {
    type: [String, Array, Boolean] as PropType<Shade>,
    default: () => [0.3, '#000000']
  },
  /**
   * 是否点击遮罩关闭
   * 类型：Boolean，默认：false
   * 如果你的shade是存在的，那么你可以设定shadeClose来控制点击弹层外区域关闭。
   */
  shadeClose: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  /**
   * 自动关闭所需毫秒
   * 类型：Number，默认：0
   * 默认不会自动关闭。当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
   */
  time: {
    type: Number as PropType<number>,
    default: 0
  },
  /**
   * 弹出动画
   * 类型：Number，默认：0
   * anim: -1 关闭
   * anim: 0	平滑放大。默认
   * anim: 1	从上掉落
   * anim: 2	从最底部往上滑入
   * anim: 3	从左滑入
   * anim: 4	从左翻滚
   * anim: 5	渐显
   * anim: 6	抖动
   */
  anim: {
    type: Number as PropType<AnimationType>,
    default: 0
  },
  /**
   * 关闭动画
   * 类型：Boolean，默认：true
   * 默认情况下，关闭层时会有一个过度动画。如果你不想开启，设置 isOutAnim: false 即可
   */
  isOutAnim: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * 最大最小化
   * 类型：Boolean，默认：false
   * 该参数值对type:1和type:2有效。默认不显示最大小化按钮。需要显示配置maxmin: true即可
   */
  maxmin: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  /**
   * 固定
   * 类型：Boolean，默认：true
   * 即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
   */
  fixed: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * 是否允许拉伸
   * 类型：Boolean，默认：true
   * 默认情况下，你可以在弹层右下角拖动来拉伸尺寸。如果对指定的弹层屏蔽该功能，设置 false即可。该参数对loading、tips层无效
   */
  resize: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * 是否允许浏览器出现滚动条
   * 类型：Boolean，默认：true
   * 默认允许浏览器滚动，如果设定scrollbar: false，则屏蔽
   */
  scrollbar: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * 最大宽度
   * 类型：Number，默认：360
   * 请注意：只有当area: 'auto'时，maxWidth的设定才有效。
   */
  maxWidth: {
    type: Number as PropType<number>,
    default: 360
  },
  /**
   * 最大高度
   * 类型：Number，默认：无
   * 请注意：只有当高度自适应时，maxHeight的设定才有效。
   */
  maxHeight: {
    type: Number as PropType<number>
  },
  /**
   * 层叠顺序 ?
   * 类型：，默认：19700101
   */
  zIndex: {
    type: Number as PropType<number>,
    default: 19700101
  },
  /**
   * move - 触发拖动的元素
   * 类型：String/DOM/Boolean，默认：'.layui-layer-title'
   * 默认是触发标题区域拖拽。如果你想单独定义，指向元素的选择器或者DOM即可。如move: '.mine-move'。你还配置设定move: false来禁止拖拽
   * 定义为: title | content | footer | false
   */
  move: {
    type: [String, Boolean] as PropType<Move>,
    default: 'title'
  },
  /**
   * 是否允许拖拽到窗口外
   * 类型：Boolean，默认：false
   * 默认只能在窗口内拖拽，如果你想让拖到窗外，那么设定moveOut: true即可
   */
  moveOut: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  /**
   * tips方向和颜色
   * 类型：TipsDirection/ [TipsDirection, string]，默认：'r'
   * tips层的私有参数。支持上右下左四个方向，
   * 通过t-r-b-l进行方向设定。如tips: 'b' 则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: ['b', '#c00']
   */
  tips: {
    type: [String, Array] as PropType<Tips>,
    default: () => ['r', '#000']
  },
  /**
   * 是否允许多个tips
   * 类型：Boolean，默认：false
   * 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
   */
  tipsMore: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  /**
   * 是否默认堆叠在左下角
   * 类型：Boolean，默认：true
   */
  minStack: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  closeBtn: {
    type: [Number, Boolean] as PropType<BtnType>,
    default: false
  },
  /**
   * tooltips
   * 新增 follow
   */
  follow: {
    type: [String, Object] as PropType<Follow>,
    required: false // 为undefined时取slot default dom
  }
} as const

export interface LayerEmits {
  /**
   * 拖动完毕后的回调方法
   */
  moveEnd: (layer: any) => void
  /**
   * 监听窗口拉伸动作
   * 类型: Function，默认：null
   * 当你拖拽弹层右下角对窗体进行尺寸调整时，如果你设定了该回调，则会执行。回调返回一个参数：当前层的DOM对象
   */
  resizing: (layer: any) => void
  /**
   * 确定按钮回调方法
   * yes rename to `ok`
   */
  ok: (layer: any) => void
  /**
   * cancel rename to 'close'
   */
  close: (layer: any) => void
  /**
   * 层销毁后触发
   * end rename to 'destroy'
   */
  destroy: (layer: any) => void
  // full/min/restore -分别代表最大化、最小化、还原 后触发的回调
  full: (layer: any) => void
  min: (layer: any) => void
  restore: (layer: any) => void
}

/**
 * layer shade
 */
export type ShadeProps = ExtractPropTypes<typeof shadeProps>
export const shadeProps = {
  shade: layerProps.shade,
  shadeClose: layerProps.shadeClose
} as const

export interface LayerInstanceMethods {
  open: (options: any) => number // number is z-index value => changed to  vue component instance
  alert: (options: any) => number
  confirm: (options: any) => number
  msg: (options: any) => number
  load: (options: any) => number
  tips: (options: any) => number
  close: (zIndex: number) => boolean
  closeAll: (type: number) => boolean
  setTop: (zIndex: number) => void
  full: (layer: any) => void
  min: (layer: any) => void
  restore: (layer: any) => void
}
