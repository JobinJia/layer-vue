<script lang="ts" setup>
import { shadeProps } from '../props'
import { useShade } from '../../../composables/shade'

const props = defineProps(shadeProps)

const { shadeStyle } = useShade(props)

</script>
<template>
  <div class="layui-layer-shade" :style="shadeStyle"></div>
</template>
