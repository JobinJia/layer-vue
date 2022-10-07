<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { computed, ref, unref } from 'vue'
import { useZIndex } from '../../../../composables/zIndex'
import { layerProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'
import { useMove } from '../../../../composables/move'
import { useArea } from '../../../../composables/area'
import { useContentHeight } from '../../../../composables/contentHeight'
import { useMinMax } from '../../../../composables/maxmin'

const props = defineProps(layerProps)
const emit = defineEmits<{
  (event: 'close', visible: boolean): void
  (event: 'resizing'): void
  (event: 'move-end'): void
}>()

const layerModalRefEl = ref<HTMLElement | null>(null)
// move el
const moveRefEl = ref<HTMLElement | null>(null)
// content el
const modalContentRefEl = ref<HTMLElement | null>(null)
// resize el
const resizeRefEl = ref<HTMLElement | null>(null)
// btn el
const btnRefEl = ref<HTMLElement | null>(null)

// logics
const { offsetTop, offsetLeft } = useOffset(props, layerModalRefEl)
const { width, height } = useArea(props)

const { zIndex, moveToTop } = useZIndex(props)

const dynamicModalStyles = ref<CSSProperties>({
  transition: 'none',
  overflow: 'unset'
})

// move
useMove(props, layerModalRefEl, moveRefEl, resizeRefEl, { offsetTop, offsetLeft, width, height }, emit)

const { contentStyles } = useContentHeight(props, layerModalRefEl, moveRefEl, modalContentRefEl, btnRefEl, height)

const { modalClasses, openMaxMin, showMinIcon, minIconClasses, showMaxIcon, min, max } = useMinMax(
  props,
  dynamicModalStyles,
  { offsetTop, offsetLeft, width, height },
  layerModalRefEl,
  moveRefEl
)

const basicStyle = computed<CSSProperties>(() => {
  return {
    zIndex: unref(zIndex),
    position: props.fixed ? 'fixed' : 'absolute',
    left: offsetLeft.value + 'px',
    top: offsetTop.value + 'px',
    width: `${width.value}px`,
    height: `${height.value}px`,
    ...unref(dynamicModalStyles)
  }
})
// auto close logics
useAutoClose(props, emit)
</script>

<template>
  <div
    class="layui-layer"
    :class="modalClasses"
    ref="layerModalRefEl"
    :style="basicStyle"
    @click.stop.prevent="moveToTop"
  >
    <div ref="moveRefEl" class="layui-layer-title" style="cursor: move">信息{{ props.maxmin }}</div>
    <div ref="modalContentRefEl" class="layui-layer-content layui-layer-padding" :style="contentStyles">
      <i class="layui-layer-ico layui-layer-ico6"></i>
      {{ basicStyle }}
      <slot></slot>
    </div>
    <div ref="btnRefEl" class="layui-layer-btn">
      <a class="layui-layer-btn0" @click.stop="emit('close', false)">确定</a>
    </div>
    <span class="layui-layer-setwin">
      <a v-if="showMinIcon && openMaxMin" class="layui-layer-min" href="javascript:;" @click.stop="min">
        <cite></cite>
      </a>
      <a
        v-if="showMaxIcon && openMaxMin"
        :class="minIconClasses"
        class="layui-layer-ico layui-layer-max"
        href="javascript:;"
        @click.stop="max"
      ></a>
      <a
        class="layui-layer-ico layui-layer-close layui-layer-close1"
        href="javascript:;"
        @click.stop="emit('close', false)"
      ></a>
    </span>
    <span ref="resizeRefEl" class="layui-layer-resize"></span>
  </div>
</template>

<style scoped lang="css"></style>
