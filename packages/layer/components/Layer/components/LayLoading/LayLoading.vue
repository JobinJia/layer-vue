<script setup lang="ts">
import { layerProps } from '../../props'
import { useGlobalCache } from '../../../../composables/globalCache'
import { useArea } from '../../../../composables/area'
import { computed, ref, toRefs, useSlots } from 'vue'
import { useShade } from '../../../../composables/shade'
import { useOffset } from '../../../../composables/offset'
import { useLayerTransition } from '../../../../composables/transition'
import { useStyles } from '../../../../composables/styles'
import { useAutoCloseByVisible } from '../../../../composables/autoClose'

const props = defineProps(layerProps)
const slots = useSlots()
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
}>()

const { visible, type } = toRefs(props)

const layerMainRefEl = ref<HTMLElement | null>(null)

// 全局缓存
const { globalCacheData } = useGlobalCache(props)

const { width, height } = useArea(props, { layerMainRefEl, globalCacheData })

const { shadeStyles, showShade } = useShade(props, { globalCacheData })

const { left, top } = useOffset(props, {
  layerMainRefEl,
  globalCacheData
})

// transition
const { layerTransition } = useLayerTransition(props)

// auto close
useAutoCloseByVisible(props, emit)

// styles
const { layerStyles, layerClasses } = useStyles(props, {
  globalCacheData,
  slots,
  width,
  height,
  left,
  top
})

const contentStyles = computed(() => {
  return [
    'layui-layer-content',
    {
      [`layui-layer-loading${props.loadingType}`]: true
    }
  ]
})
</script>

<template>
  <teleport to="body">
    <div v-if="showShade" class="layui-layer-shade" :style="shadeStyles"></div>
    <transition :enter-active-class="layerTransition.in" :leave-active-class="layerTransition.out">
      <div ref="layerMainRefEl" v-if="visible" :style="layerStyles" :class="layerClasses">
        <div :class="contentStyles"></div>
      </div>
    </transition>
  </teleport>
</template>
