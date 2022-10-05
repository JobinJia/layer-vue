<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { useZIndex } from '../../../../composables/zIndex'
import { computed, ref } from 'vue'
import { layerProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'
import { useIcon } from '../../../../composables/icon'

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
const tipsClasses = computed(() => {
  const clazz = props.icon === -1 ? 'layui-layer-hui' : ['layui-layer-msg']
  return clazz
})
// auto close logics
useAutoClose(props, emit)
// icon
const { showIcon, iconClasses } = useIcon(props)
</script>
<template>
  <div
    ref="layerModalRefEl"
    :class="tipsClasses"
    :style="basicStyle"
    class="layui-layer layui-layer-dialog layui-layer-border"
  >
    <div class="layui-layer-content" :class="{ 'layui-layer-padding': props.icon !== -1 }">
      <i v-if="showIcon" :class="iconClasses"></i>提示信息
    </div>
    <span class="layui-layer-setwin"></span>
  </div>
</template>
