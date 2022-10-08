import {type LayerProps, ShadeProps} from '../../components/Layer/props'
import { computed } from 'vue'
import { pick } from 'lodash'

export function usePickProps<T extends LayerProps, U extends any>(props: T, componentProps: U) {
  const pickProps = computed(() => {
    const ret = pick(props, Object.keys(componentProps))
    return ret as ShadeProps
  })
  return {
    pickProps
  }
}
