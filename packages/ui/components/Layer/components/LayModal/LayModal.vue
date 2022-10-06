<script setup lang="ts">
import {type CSSProperties, unref} from 'vue'
import { useZIndex } from '../../../../composables/zIndex'
import { computed, ref } from 'vue'
import { layerProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'
import { useMove } from '../../../../composables/move'
import { useArea } from '../../../../composables/area'
import {useContentHeight} from "../../../../composables/contentHeight";

const props = defineProps(layerProps)
const emit = defineEmits<{
  (event: 'close', visible: boolean): void
  (event: 'resizing'): void
  (event: 'move-end'): void
}>()

const { zIndex, moveToTop } = useZIndex(props)

const layerModalRefEl = ref<HTMLElement | null>(null)
// move el
const moveRefEl = ref<HTMLElement | null>(null)
// content el
const modalContentRefEl = ref<HTMLElement | null>(null)
// resize el
const resizeRefEl = ref<HTMLElement | null>(null)
// btn el
const btnRefEl = ref<HTMLElement | null>(null)

const { offsetTop, offsetLeft } = useOffset(props, layerModalRefEl)
const { width, height } = useArea(props)

// move
useMove(props, layerModalRefEl, moveRefEl, resizeRefEl, { offsetTop, offsetLeft, width, height }, emit)

const { contentStyles } = useContentHeight(props, layerModalRefEl, moveRefEl, modalContentRefEl, btnRefEl, height)

const basicStyle = computed<CSSProperties>(() => {
  return {
    zIndex: unref(zIndex),
    position: props.fixed ? 'fixed' : 'absolute',
    left: offsetLeft.value + 'px',
    top: offsetTop.value + 'px',
    width: `${width.value}px`,
    height: `${height.value}px`
  }
})
// auto close logics
useAutoClose(props, emit)

</script>

<template>
  <div class="layui-layer layui-layer-dialog" ref="layerModalRefEl" :style="basicStyle" @click.stop.prevent="moveToTop">
    <div ref="moveRefEl" class="layui-layer-title" style="cursor: move">信息</div>
    <div ref="modalContentRefEl" class="layui-layer-content layui-layer-padding" :style="contentStyles">
      <i class="layui-layer-ico layui-layer-ico6"></i>
      <slot></slot>
    </div>
    <span class="layui-layer-setwin">
      <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="emit('close', false)">
      </a>
    </span>
    <div ref="btnRefEl" class="layui-layer-btn">
      <a class="layui-layer-btn0" @click.stop="emit('close', false)">确定</a>
    </div>
    <span ref="resizeRefEl" class="layui-layer-resize"></span>
  </div>
</template>

<style scoped lang="css"></style>
