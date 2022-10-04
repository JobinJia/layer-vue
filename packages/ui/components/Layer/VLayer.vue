<script setup lang="ts">
import {type Component } from 'vue'
import { watch, useSlots } from 'vue'
import VLayerWrapper from './VLayerWrapper.vue'
import VLayerTips from './components/LayToolTip/LayToolTip.vue'
import { layerProps } from './props'
import { computed, shallowRef, toRefs, unref, useAttrs, watchEffect } from 'vue'
const props = defineProps(layerProps)
const attrs = useAttrs()
const slots = useSlots()

const { type } = toRefs(props)

const comp = shallowRef<Component>(VLayerWrapper)

watch(
  type,
  (typeVal) => {
    switch (typeVal) {
      case 'tips':
        comp.value = VLayerTips
        break
      default:
        break
    }
  },
  { immediate: true }
)

const bindProps = computed(() => {
  return {
    ...props,
    ...attrs
  }
})
</script>

<template>
  <component :is="comp" v-bind="bindProps">
    <template v-for="name in Object.keys(slots)" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </component>
</template>
