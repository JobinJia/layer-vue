import type { CSSProperties, Ref } from 'vue'
import type { LayerProps } from '../components/Layer/props'
import type { LayerGlobalCacheRecord } from './layerCache'
import { ref, toRefs, unref, watch } from 'vue'

export interface ShadeOption {
  globalCacheData: Ref<LayerGlobalCacheRecord>
}

export interface ShadeReturn {
  showShade: Ref<boolean>
  shadeStyles: Ref<CSSProperties>
}

export function useShade(props: LayerProps, { globalCacheData }: ShadeOption): ShadeReturn {
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
      showShade.value = v && ['dialog', 'page', 'loading'].includes(t) && s !== false
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
          zIndex: unref(globalCacheData).zIndex - 1
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
