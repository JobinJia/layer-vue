import { computed, CSSProperties, ref, Ref, toRefs, unref, watch, watchEffect } from 'vue'
import {LayerProps} from "../components/Layer/props";

export function useShade(props: LayerProps, zIndex: Ref<number>) {
  const { shade, type, visible } = toRefs(props)

  const showShade = ref<boolean>(true)
  const shadeStyles = ref<CSSProperties>({})

  watch(
    () => ({
      v: visible.value,
      t: type.value,
      s: shade.value
    }),
    ({ v, t, s }) => {
      showShade.value = v && ['dialog', 'page'].includes(t) && s !== false
    },
    { immediate: true }
  )

  watch(
    shade,
    (shadeVal) => {
      if (shadeVal === false) {
        shadeStyles.value = {}
      } else {
        shadeStyles.value = {
          'background-color': unref(shade)[1] || '#000',
          opacity: unref(shade)[0] || unref(shade),
          zIndex: unref(zIndex) - 1
        }
      }
    },
    { immediate: true }
  )

  return {
    showShade,
    shadeStyles
  }
}
