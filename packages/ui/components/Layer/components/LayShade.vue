<script lang="ts" setup>
import { computed, toRefs, unref } from 'vue'
import { shadeProps } from '../props'

const props = defineProps(shadeProps)

const { shade } = toRefs(props)
const shadeStyle = computed(() => {
  const shadeVal = unref(shade)
  if (shadeVal === false) {
    return {}
  } else {
    if (shadeVal.length === 1) {
      return {
        opacity: shadeVal[0]
      }
    } else {
      const [opacity, backgroundColor] = shadeVal
      return {
        backgroundColor,
        opacity
      }
    }
  }
})
</script>
<template>
  <div class="layui-layer-shade" :style="shadeStyle"></div>
</template>
