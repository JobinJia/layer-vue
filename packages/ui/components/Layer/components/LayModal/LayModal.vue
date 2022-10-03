<script setup lang="ts">
import { useZIndex } from '../../../../composables/zIndex'
import { computed, CSSProperties, ref } from 'vue'
import { layerProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'

const props = defineProps(layerProps)
const emit = defineEmits<{
  (event: 'close', visible: boolean): void
}>()

const { zIndex } = useZIndex()

const layerModalRefEl = ref<HTMLElement | null>(null)
const { offsetTop, offsetLeft } = useOffset(props, layerModalRefEl)
const basicStyle = computed<CSSProperties>(() => {
  return {
    zIndex: zIndex,
    position: props.fixed ? 'fixed' : 'absolute',
    left: offsetLeft.value + 'px',
    top: offsetTop.value + 'px'
  }
})
// auto close logics
useAutoClose(props, emit)
</script>

<template>
  <div class="layui-layer layui-layer-dialog" ref="layerModalRefEl" :style="basicStyle">
    <div class="layui-layer-title" style="cursor: move">信息</div>
    <div id="" class="layui-layer-content layui-layer-padding">
      <i class="layui-layer-ico layui-layer-ico6"></i>
      见到你真的很高兴
    </div>
    <span class="layui-layer-setwin">
      <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="emit('close', false)">
      </a>
    </span>
    <div class="layui-layer-btn">
      <a class="layui-layer-btn0" @click="emit('close', false)">确定</a>
    </div>
    <span class="layui-layer-resize"></span>
  </div>
</template>

<style scoped lang="css"></style>
