<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { useZIndex } from '../../../../composables/zIndex'
import { computed, ref } from 'vue'
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
  <div
    :style="basicStyle"
    ref="layerModalRefEl"
    class="layui-layer layui-layer-dialog layui-layer-border layui-layer-msg layui-layer-hui"
  >
    <div id="" class="layui-layer-content">一段提示信息{{ props.time }}</div>
    <span class="layui-layer-setwin"></span>
  </div>
</template>
