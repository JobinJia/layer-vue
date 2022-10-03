<script setup lang="ts">
import LayModal from './components/LayModal/LayModal.vue'
import LayShade from './components/LayShade.vue'
import LayTips from './components/LayTips/LayTips.vue'
import LayToolTip from './components/LayToolTip/LayToolTip.vue'
import { layerProps } from './props'
import { computed, toRefs, unref, useSlots } from 'vue'
import { useLayerTransition } from '../../composables/transition'
import { useComponentProps } from '../../composables/componentProps'

const props = defineProps(layerProps)

const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type } = toRefs(props)

// 是否展示 Shade层
const showShade = computed(() => {
  return unref(visible) && unref(type) === 0
})
// transition
const { layerTransition } = useLayerTransition(props)
// dynamic props
const { dynamicProps } = useComponentProps(props)

const slots = useSlots()
</script>

<template>
  <teleport to="body">
    <LayShade v-if="showShade" :shade="props.shade" :shade-close="props.shadeClose"></LayShade>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <LayModal v-if="visible" v-bind="dynamicProps" @close="(v) => $emit('update:visible', v)"></LayModal>
      <!--      <LayTips v-if="visible" v-bind="dynamicProps" @close="(v) => $emit('update:visible', v)"></LayTips>-->
    </transition>
  </teleport>
</template>
