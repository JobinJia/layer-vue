import { type IconType, type LayerProps } from '../components/Layer/props'
import { computed, ref } from 'vue'
import { toRefs, watch } from 'vue'
// import LayWarning from '../components/LayerIcon/LayWarning.vue'
// import LaySuccess from '../components/LayerIcon/LaySuccess.vue'
// import LayError from '../components/LayerIcon/LayError.vue'
// import LayQuestion from '../components/LayerIcon/LayQuestion.vue'
// import LayLock from '../components/LayerIcon/LayLock.vue'
//
// const iconMap = new Map<IconType, Component>()
// iconMap.set('warning', LayWarning)
// iconMap.set('success', LaySuccess)
// iconMap.set('error', LayError)
// iconMap.set('question', LayQuestion)
// iconMap.set('lock', LayLock)

export function useIcon(props: LayerProps) {
  const { icon } = toRefs(props)
  // const IconComp = shallowRef<Component | string>({})
  const iconClasses = ref<string[]>(['layui-layer-ico'])
  const showIcon = computed(() => icon.value !== -1)

  watch(
    icon,
    (iconVal) => {
      if (iconVal !== -1) {
        const prefix = 'layui-layer-ico'
        iconClasses.value.push(`${prefix}${iconVal}`)
      }
    },
    { immediate: true }
  )

  // watch(
  //   icon,
  //   (iconVal) => {
  //     if (iconVal !== false) {
  //       const component = iconMap.get(iconVal)
  //       IconComp.value = resolveComponent(component.name)
  //     }
  //   },
  //   { immediate: true }
  // )

  return {
    // IconComp
    showIcon,
    iconClasses
  }
}
