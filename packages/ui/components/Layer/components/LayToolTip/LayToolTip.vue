<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { layerProps } from '../../props'
import { useAutoClose } from '../../../../composables/autoClose'
import { useToolTip } from '../../../../composables/tooltip'
const props = defineProps(layerProps)
const layerToolTipRefEl = ref<HTMLElement | null>(null)
const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type, content } = toRefs(props)

// follow ref
const referenceRefEl = ref<HTMLElement | null>(null)

const { tipsGStyles, tipsGClasses, tipsContentStyle, tipsStyles } = useToolTip(props, layerToolTipRefEl, referenceRefEl)
</script>

<template>
  <div>
    <teleport to="body">
      <!-- layer-anim-close -->
      <div v-if="visible" ref="layerToolTipRefEl" :style="tipsStyles" class="layui-layer layui-layer-tips layer-anim">
        <div class="layui-layer-content" :style="tipsContentStyle">
          <slot name="content">
            {{ content }}
          </slot>
          <i :class="tipsGClasses" :style="tipsGStyles" class="layui-layer-TipsG"></i>
        </div>
        <span class="layui-layer-setwin"></span>
      </div>
    </teleport>
    <div ref="referenceRefEl" @click="emit('update:visible', !props.visible)">
      <slot></slot>
    </div>
  </div>
</template>
