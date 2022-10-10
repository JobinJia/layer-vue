<script setup lang="ts">
import {layerProps} from "../../Layer/props";
import {computed, CSSProperties, ref, StyleValue, unref, useSlots} from "vue";
import {isNumber} from "lodash";

const props = defineProps(layerProps)
const slots = useSlots()

//五种原始层模式
const type = ['dialog', 'page', 'iframe', 'loading', 'tips']
const zIndex = ref(19920115)

const layerClasses = computed(() => {
  return [
    'layui-layer',
    `layui-layer-${props.type}`,
    {
      'layui-layer-border': (props.type == 'dialog' || props.type == 'iframe') && !props.shade
    }
  ]
})

const layerStyles = computed((): CSSProperties => {
  return {
    zIndex: unref(zIndex),
    width: props.area[0],
    height: props.area[1],
    position: props.fixed ? 'fixed' : 'absolute'
  }
})

// title
const showTitle = computed(() => {
  return props.title || Object.keys(slots).includes('title')
})

// is max
const isMax = computed(() => {
  return props.maxmin && (props.type === 'page' || props.type === 'iframe')
})

// close class
const closeBtnClasses = computed(() => {
  const showCloseBtn = unref(showTitle) && isNumber(props.closeBtn)
  const closeBtnSuffix = showCloseBtn ? props.closeBtn : props.type === 'tips' ? '1' : '2'

  return [
    'layui-layer-ico',
    {
      'layui-layer-close': isNumber(props.closeBtn),
      [`layui-layer-close-${closeBtnSuffix}`]: showCloseBtn
    }
  ]
})
</script>

<template>
  <teleport to="body">
    <div class="layui-layer-shade" :style="{ zIndex: zIndex - 1 }"></div>
    <div :class="layerClasses" :style="layerStyles">
      <div v-if="showTitle" class="layui-layer-title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <span class="layui-layer-setwin" >
        <a v-if="isMax" class="layui-layer-min" href="javascript:;">
          <cite></cite>
        </a>
        <a v-if="isMax" class="layui-layer-ico layui-layer-max" href="javascript:;"></a>
        <a class="layui-layer-ico" :class="closeBtnClasses"></a>
      </span>
      <slot name="buttons">
        <div class="layui-layer-btn layui-layer-btn-r">
          确定
        </div>
      </slot>
      <span v-if="props.resize" class="layui-layer-resize"></span>
    </div>
  </teleport>
</template>

<style scoped lang="css">

</style>
