<script setup lang="ts">
import { layerProps } from '../../../Layer/props'
import { useShade } from '../../../../composables/shade'
import { ref, toRefs, useSlots } from 'vue'
import { useStyles } from '../../../../composables/styles'
import { useLayerTransition } from '../../../../composables/transition'
import { useOffset } from '../../../../composables/offset'
import { useContentStyle } from '../../../../composables/contentStyles'
import { useArea } from '../../../../composables/area'
import { useDrag } from '../../../../composables/drag'
import { useResize } from '../../../../composables/resize'
import { useMaxMin } from '../../../../composables/maxmin'
import { useGlobalCache } from '../../../../composables/globalCache'

const props = defineProps(layerProps)
const slots = useSlots()
const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
  (event: 'resizing'): void
  (event: 'move-end'): void
}>()

const layerMainRefEl = ref<HTMLElement | null>(null)
const layerTitleRefEl = ref<HTMLElement | null>(null)
const layerContentRefEl = ref<HTMLElement | null>(null)
const layerBtnRefEl = ref<HTMLElement | null>(null)
const layerResizeRefEl = ref<HTMLElement | null>(null)

// 全局缓存
const { globalCacheIns, globalCacheData, updateGlobalCache, moveToTop } = useGlobalCache(props)

const { width, height } = useArea(props, { layerMainRefEl, globalCacheData })

const { contentStyle } = useContentStyle(props, {
  layerMainRefEl,
  layerBtnRefEl,
  layerTitleRefEl,
  layerContentRefEl,
  height
})

const { visible, type } = toRefs(props)

const { shadeStyles, showShade, handleClickShade } = useShade(props, { globalCacheData, emit })

const { left, top } = useOffset(props, {
  layerMainRefEl,
  globalCacheData
})

// transition
const { layerTransition } = useLayerTransition(props)
// drag and resize
useDrag(props, { moveElRef: layerTitleRefEl, layerMainRefEl, top, left })
useResize(props, { layerMainRefEl, layerResizeRefEl, height, width })
// max min
const { beforeMaxMinStyles, minimize, restoreOrFull } = useMaxMin(props, {
  layerTitleRefEl,
  layerMainRefEl,
  globalCacheData,
  globalCacheIns,
  updateGlobalCache,
  width,
  height,
  left,
  top,
  showShade
})

const {
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
} = useStyles(props, {
  globalCacheData,
  slots,
  width,
  height,
  left,
  top,
  beforeMaxMinStyles
})
</script>

<template>
  <teleport to="body">
    <div v-if="showShade" class="layui-layer-shade" :style="shadeStyles"  @click.stop.prevent="handleClickShade"></div>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <div v-if="visible" ref="layerMainRefEl" :style="layerStyles" :class="layerClasses">
        <div
          v-if="showTitle"
          ref="layerTitleRefEl"
          class="layui-layer-title"
          :style="titleStyles"
          @click.stop.prevent="moveToTop"
        >
          <slot name="title">{{ props.title }}</slot>
        </div>
        <div :class="contentClasses" :style="contentStyle" ref="layerContentRefEl">
          <i v-if="showIcon" :class="iconClasses"></i>
          <slot>
            {{ props.content }}
          </slot>
        </div>
        <span class="layui-layer-setwin">
          <a
            v-if="isMax && !globalCacheData.maxmin.isMax && !globalCacheData.maxmin.isMin"
            class="layui-layer-min"
            href="javascript:;"
            @click.stop.prevent="minimize"
          >
            <cite></cite>
          </a>
          <a v-if="isMax" :class="maxIconClasses" href="javascript:;" @click.prevent.stop="restoreOrFull"></a>
          <a :class="closeBtnClasses" href="javascript:;" @click.stop.prevent="emit('update:visible', false)"></a>
        </span>
        <div :class="footerBtnClasses" ref="layerBtnRefEl">
          <slot name="footer">
            <a class="layui-layer-btn0" @click.prevent.stop="emit('update:visible', false)">确定</a>
          </slot>
        </div>
        <span v-if="props.resize" ref="layerResizeRefEl" class="layui-layer-resize"></span>
      </div>
    </transition>
  </teleport>
</template>
