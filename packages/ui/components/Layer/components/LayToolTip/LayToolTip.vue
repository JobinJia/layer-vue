<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { layerProps } from '../../props'
import { useAutoCloseByVisible } from '../../../../composables/autoClose'
import { useToolTip } from '../../../../composables/tooltip'
import { useLayerTransition } from '../../../../composables/transition'
const props = defineProps(layerProps)
const layerToolTipRefEl = ref<HTMLElement | null>(null)
const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type, content } = toRefs(props)
// transition
const { layerTransition } = useLayerTransition(props)

// follow ref
const referenceRefEl = ref<HTMLElement | null>(null)

const { tipsGStyles, tipsGClasses, tipsContentStyle, tipsStyles } = useToolTip(props, layerToolTipRefEl, referenceRefEl)
// 自动关闭
useAutoCloseByVisible(props, emit)
</script>

<template>
  <span>
    <teleport to="body">
      <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
        <div v-if="visible" ref="layerToolTipRefEl" :style="tipsStyles" class="layui-layer layui-layer-tips layer-anim">
          <div class="layui-layer-content" :style="tipsContentStyle">
            <slot name="content">
              {{ content }}
            </slot>
            <i :class="tipsGClasses" :style="tipsGStyles" class="layui-layer-TipsG"></i>
          </div>
          <span class="layui-layer-setwin"></span>
        </div>
      </transition>
    </teleport>
    <div ref="referenceRefEl" @click="emit('update:visible', !props.visible)">
      <slot></slot>
    </div>
  </span>
</template>
