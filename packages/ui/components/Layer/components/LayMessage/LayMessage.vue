<script setup lang="ts">
import { type CSSProperties } from 'vue'
import { type LayerProps } from '../../props'
import { toRefs, unref } from 'vue'
import { useZIndex } from '../../../../composables/zIndex'
import { computed, ref } from 'vue'
import { layerProps, shadeProps } from '../../props'
import { useOffset } from '../../../../composables/offset'
import { useAutoClose } from '../../../../composables/autoClose'
import { useIcon } from '../../../../composables/icon'
import { useLayerTransition } from '../../../../composables/transition'
import { usePickProps } from '../../../../composables/pickProps'
import VLayShade from '../LayShade.vue'

const props = defineProps(layerProps)

const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type } = toRefs(props)

// type控制是否展示 Shade层
const showShade = computed(() => {
  return unref(visible) && ['dialog', 'page'].includes(unref(type))
})
// transition
const { layerTransition } = useLayerTransition(props)
// shade props
const { pickProps } = usePickProps<LayerProps, typeof shadeProps>(props, shadeProps)

const { zIndex } = useZIndex(props)

const layerModalRefEl = ref<HTMLElement | null>(null)
const { offsetTop, offsetLeft } = useOffset(props, layerModalRefEl)
const basicStyle = computed<CSSProperties>(() => {
  return {
    zIndex: unref(zIndex),
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
  <teleport to="body">
    <VLayShade v-if="showShade" v-bind="pickProps"></VLayShade>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <div
        v-if="visible"
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
    </transition>
  </teleport>
</template>
