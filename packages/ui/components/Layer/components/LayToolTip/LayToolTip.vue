<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { layerProps } from '../../props'
import { useAutoClose } from '../../../../composables/autoClose'
import {useToolTip} from "../../../../composables/tooltip";
const props = defineProps(layerProps)
const layerToolTipRefEl = ref<HTMLElement | null>(null)
const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type } = toRefs(props)

// follow ref
const referenceRefEl = ref<HTMLElement | null>(null)

const { followInstance } = useToolTip(props, layerToolTipRefEl, referenceRefEl)

</script>

<template>
  <div>
    <teleport to="body">
      <!-- layer-anim-close -->
      <div
        v-if="visible"
        ref="layerToolTipRefEl"
        class="layui-layer layui-layer-tips layer-anim"
        id="layui-layer100162"
        type="tips"
        times="100162"
        showtime="3000"
        contype="object"
      >
        <div id="" class="layui-layer-content">Hi，我是tips<i class="layui-layer-TipsG layui-layer-TipsR"></i></div>
        <span class="layui-layer-setwin"></span>
      </div>
    </teleport>
    <div ref="referenceRefEl">
      <slot></slot>
    </div>
  </div>
</template>
