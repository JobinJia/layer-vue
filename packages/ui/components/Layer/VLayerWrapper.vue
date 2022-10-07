<script setup lang="ts">
import { type Component } from 'vue'
import { type LayerProps } from './props'
import { useSlots } from 'vue'
import LayModal from './components/LayModal/LayModal.vue'
import LayShade from './components/LayShade.vue'
import LayTips from './components/LayTips/LayTips.vue'
import { layerProps, shadeProps } from './props'
import { computed, shallowRef, toRefs, unref, watch } from 'vue'
import { useLayerTransition } from '../../composables/transition'
import { useComponentProps } from '../../composables/componentProps'
import { usePickProps } from '../../composables/pickProps'

const props = defineProps(layerProps)

const slots = useSlots()

defineEmits<{
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

// shade props
const { pickProps } = usePickProps<LayerProps, typeof shadeProps>(props, shadeProps)
</script>

<template>
  <teleport to="body">
    <LayShade v-if="showShade" v-bind="pickProps" :shade-close="props.shadeClose"></LayShade>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <component v-if="visible" :is="view" v-bind="dynamicProps" @close="(v) => $emit('update:visible', v)">
        <template v-for="name in Object.keys(slots)" :key="name" #[name]>
          <slot :name="name"></slot>
        </template>
      </component>
    </transition>
  </teleport>
</template>
