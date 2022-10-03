import { LayerProps } from '../components/Layer/props'
import { ref, toRefs, watch } from 'vue'

export function useComponentProps(props: LayerProps) {
  const { type } = toRefs(props)
  const dynamicProps = ref<Partial<LayerProps>>({})

  function generateProps(type: LayerProps['type']) {
    let cacheProps: Partial<LayerProps> = {}
    switch (type) {
      // tips
      case 4:
        cacheProps = {
          type: 4,
          // closeBtn: false,
          time: 3000,
          shade: false,
          resize: false,
          fixed: false,
          maxWidth: 260
        }
        break
      default:
        break
    }
    dynamicProps.value = {
      ...props,
      ...cacheProps
    }
  }

  watch(
    type,
    (typeVal) => {
      generateProps(typeVal)
    },
    { immediate: true }
  )

  return {
    dynamicProps
  }
}
