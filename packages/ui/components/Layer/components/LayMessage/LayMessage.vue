<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { type LayerProps } from '../../props'
import { toRefs, unref } from 'vue'
import { computed, ref } from 'vue'
import { layerProps, shadeProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'
import { useIcon } from '../../../../composables/icon'
import { useLayerTransition } from '../../../../composables/transition'
import { usePickProps } from '../../../../composables/pickProps'
import { useGlobalCache } from '../../../../composables/globalCache'
import { useShade } from '../../../../composables/shade'

const props = defineProps(layerProps)

const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { globalCacheData } = useGlobalCache(props)

const { visible, type } = toRefs(props)

// type控制是否展示 Shade层
const { shadeStyles, showShade } = useShade(props, { globalCacheData })
// transition
const { layerTransition } = useLayerTransition(props)
// shade props
const { pickProps } = usePickProps<LayerProps, typeof shadeProps>(props, shadeProps)

const layerMainRefEl = ref<HTMLElement | null>(null)
const { left, top } = useOffset(props, { layerMainRefEl, globalCacheData })
const basicStyle = computed<CSSProperties>(() => {
  return {
    zIndex: unref(globalCacheData).zIndex,
    position: props.fixed ? 'fixed' : 'absolute',
    left: left.value + 'px',
    top: top.value + 'px'
  }
})
const tipsClasses = computed(() => {
  return [
    'layui-layer',
    'layui-layer-dialog',
    'layui-layer-border',
    props.icon === -1 ? 'layui-layer-hui' : 'layui-layer-msg'
  ]
})
// auto close logics
useAutoClose(props, emit)
// icon
const { showIcon, iconClasses } = useIcon(props)
</script>
<template>
  <teleport to="body">
    <div v-if="showShade" class="layui-layer-shade" :style="shadeStyles"></div>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <div v-if="visible" ref="layerMainRefEl" :class="tipsClasses" :style="basicStyle">
        <div class="layui-layer-content" :class="{ 'layui-layer-padding': props.icon !== -1 }">
          <i v-if="showIcon" :class="iconClasses"></i>提示信息
        </div>
        <span class="layui-layer-setwin"></span>
      </div>
    </transition>
  </teleport>
</template>
