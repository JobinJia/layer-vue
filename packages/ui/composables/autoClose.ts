import { type LayerProps } from '../components/Layer/props'
import { onMounted, toRefs, unref, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export function useAutoClose(
  props: LayerProps,
  emit: {
    (event: 'close', visible: boolean): void
  }
) {
  const { time, visible } = toRefs(props)
  function handleAutoClose() {
    emit('close', false)
  }

  const { start } = useTimeoutFn(handleAutoClose, time, { immediate: false })

  watch(
    visible,
    (visibleVal) => {
      if (unref(time) !== 0) {
        visibleVal && start()
      }
    },
    { immediate: true }
  )
}

export function useAutoCloseByVisible(
  props: LayerProps,
  emit: {
    (event: 'update:visible', visible: boolean): void
  }
) {
  const { time, visible } = toRefs(props)
  function handleAutoClose() {
    emit('update:visible', !props.visible)
  }
  const { start } = useTimeoutFn(handleAutoClose, time, { immediate: false })
  watch(
    visible,
    (visibleVal) => {
      if (unref(time) !== 0) {
        visibleVal && start()
      }
    },
    { immediate: true }
  )
}
