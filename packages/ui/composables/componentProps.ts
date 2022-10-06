import { type LayerProps } from '../components/Layer/props'
import { ref, toRefs, unref, watchEffect } from 'vue'

export function useComponentProps(props: LayerProps) {
  const { type } = toRefs(props)
  const dynamicProps = ref<Partial<LayerProps>>({})

  function generateProps(type: LayerProps['type']) {
    let cacheProps: Partial<LayerProps> = {}
    switch (type) {
      // 原来是tips, 现在为message
      case 'message':
        cacheProps = {
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

  watchEffect(() => {
    generateProps(unref(type))
  })

  return {
    dynamicProps
  }
}
