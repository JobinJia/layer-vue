<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'default Btn'
  }
})
</script>

<template>
  <button>
    <slot>
      {{ text }}
    </slot>
  </button>
</template>
