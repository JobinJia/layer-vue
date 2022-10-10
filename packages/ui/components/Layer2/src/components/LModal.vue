<script setup lang="ts">
import { layerProps } from '../../../Layer/props'
import { useShade } from '../composables/shade'
import { useZIndex } from '../../../../composables/zIndex'
import { computed, ref, toRefs, unref, useSlots, watchEffect } from 'vue'
import { useStyles } from '../composables/styles'
import { useLayerTransition } from '../../../../composables/transition'
import { useOffset } from '../composables/offset'
import { useContentStyle } from '../composables/content-styles'
import { useArea } from '../composables/area'
import {useDrag} from "../composables/drag";

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

const { width, height } = useArea(props, layerMainRefEl)

const { contentStyle } = useContentStyle(props, {
  layerMainRefEl,
  layerBtnRefEl,
  layerTitleRefEl,
  layerContentRefEl
})

const { visible, type } = toRefs(props)

// type控制是否展示 Shade层
const showShade = computed(() => {
  return unref(visible) && ['dialog', 'page'].includes(unref(type))
})

const { zIndex } = useZIndex(props)

const { shadeStyles } = useShade(props, zIndex)

const { left, top } = useOffset(props, {
  layerMainRefEl,
  layerTitleRefEl,
  layerContentRefEl,
  layerBtnRefEl
})

// transition
const { layerTransition } = useLayerTransition(props)
// drag
const a = useDrag(props, { moveElRef: layerTitleRefEl, layerMainRefEl, top, left})

const {
  layerStyles,
  layerClasses,
  showTitle,
  titleStyles,
  contentClasses,
  isMax,
  showIcon,
  iconClasses,
  closeBtnClasses,
  footerBtnClasses
} = useStyles(props, { slots, zIndex, width, height, left, top })
</script>

<template>
  <teleport to="body">
    <div v-if="showShade" class="layui-layer-shade" :style="shadeStyles"></div>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <div v-if="visible" ref="layerMainRefEl" :style="layerStyles" :class="layerClasses">
        <div v-if="showTitle" ref="layerTitleRefEl" class="layui-layer-title" :style="titleStyles">
          <slot name="title">{{ props.title }}</slot>
        </div>
        <div :class="contentClasses" :style="contentStyle" ref="layerContentRefEl">
          <i v-if="showIcon" :class="iconClasses"></i>
          {{ contentStyle }}
          <slot>
            {{ props.content || '见到你so happy !' }}
          </slot>
        </div>
        <span class="layui-layer-setwin">
          <a v-if="isMax" class="layui-layer-min" href="javascript:;">
            <cite></cite>
          </a>
          <a v-if="isMax" class="layui-layer-ico layui-layer-max" href="javascript:;"></a>
          <a :class="closeBtnClasses" href="javascript:;" @click.stop.prevent="emit('update:visible', false)"></a>
        </span>
        <div :class="footerBtnClasses" ref="layerBtnRefEl">
          <slot name="footer">
            <a class="layui-layer-btn0" @click.prevent.stop="emit('update:visible', false)">确定</a>
          </slot>
        </div>
        <span v-if="props.resize" class="layui-layer-resize"></span>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="css"></style>
