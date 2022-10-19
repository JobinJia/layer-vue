<script setup lang="ts">
import type { Component } from 'vue'
import { watch, useSlots } from 'vue'
// import VLayerWrapper from './VLayerWrapper.vue'
import VLayerTips from './components/LayToolTip/LayToolTip.vue'
import VLayModal from './components/LayModal/LayModal.vue'
import VLayMessage from './components/LayMessage/LayMessage.vue'
import VLoading from './components/LayLoading/LayLoading.vue'
import { layerProps } from './props'
import { computed, shallowRef, toRefs, useAttrs } from 'vue'
import { useComponentProps } from '../../composables/componentProps'
const props = defineProps(layerProps)
const attrs = useAttrs()
const slots = useSlots()

const { type } = toRefs(props)

const comp = shallowRef<Component>(VLayModal)

watch(
  type,
  (typeVal) => {
    switch (typeVal) {
      case 'tips':
        comp.value = VLayerTips
        break
      case 'message':
        comp.value = VLayMessage
        break
      case 'loading':
        comp.value = VLoading
        break
      default:
        comp.value = VLayModal
        break
    }
  },
  { immediate: true }
)

// dynamic props
const { dynamicProps } = useComponentProps(props)

const bindProps = computed(() => {
  return {
    ...dynamicProps.value,
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
