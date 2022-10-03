import { LayerProps } from '../components/Layer/props'
import { onMounted, toRefs, unref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export function useAutoClose(
  props: LayerProps,
  emit: {
    (event: 'close', visible: boolean): void
  }
) {
  const { time } = toRefs(props)
  function handleAutoClose() {
    emit('close', false)
  }
  onMounted(() => {
    if (unref(time) !== 0) {
      const { start } = useTimeoutFn(handleAutoClose, time)
      start()
    }
  })
}
