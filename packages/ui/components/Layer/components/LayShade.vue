<script lang="ts" setup>
import { shadeProps } from '../props'
import { useShade } from '../../../composables/shade'

const props = defineProps(shadeProps)

const { shadeStyle, showShadeRef } = useShade(props)
</script>
<template>
  <div v-if="showShadeRef" class="layui-layer-shade" :style="shadeStyle">{{ showShadeRef }}</div>
</template>
