<script setup lang="ts">
import { type Component } from 'vue'
import { useSlots } from 'vue'
import LayModal from './components/LayModal/LayModal.vue'
import LayShade from './components/LayShade.vue'
import LayTips from './components/LayTips/LayTips.vue'
import { layerProps } from './props'
import { computed, shallowRef, toRefs, unref, watch } from 'vue'
import { useLayerTransition } from '../../composables/transition'
import { useComponentProps } from '../../composables/componentProps'

const props = defineProps(layerProps)

const slots = useSlots()

const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const { visible, type } = toRefs(props)

// 是否展示 Shade层
const showShade = computed(() => {
  return unref(visible) && unref(type) === 'dialog'
})
// transition
const { layerTransition } = useLayerTransition(props)
// dynamic props
const { dynamicProps } = useComponentProps(props)

const view = shallowRef<Component>(LayModal)

watch(
  type,
  (typeVal) => {
    switch (typeVal) {
      case 'message':
        view.value = LayTips
        break
      default:
        break
    }
  },
  { immediate: true }
)
</script>

<template>
  <teleport to="body">
    <LayShade v-if="showShade" :shade="props.shade" :shade-close="props.shadeClose"></LayShade>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <component v-if="visible" :is="view" v-bind="dynamicProps" @close="(v) => $emit('update:visible', v)">
        <template v-for="name in Object.keys(slots)" :key="name" #[name]>
          <slot :name="name"></slot>
        </template>
      </component>
      <!--      <LayModal v-if="visible" v-bind="dynamicProps" @close="(v) => emit('update:visible', v)"></LayModal>-->
      <!--      <LayTips v-if="visible" v-bind="dynamicProps" @close="(v) => $emit('update:visible', v)"></LayTips>-->
    </transition>
  </teleport>
</template>
