import { type ShadeProps } from '../components/Layer/props'
import { type CSSProperties } from 'vue'
import { ref, toRefs, unref, watch } from 'vue'
import mitt from '../utils/mitt'

const shadeMitt = mitt()

const key = Symbol()

let showShade: boolean = true

export function setShade(shade: boolean) {
  shadeMitt.emit(key, shade)
  showShade = shade
}

export function listenerShadeChange(callback: (shade: boolean) => void, immediate = true) {
  shadeMitt.on(key, callback)
  immediate && callback(showShade)
}

export function removeShadeListener() {
  shadeMitt.clear()
}

export function useShade(props: ShadeProps) {
  const { shade, visible } = toRefs(props)

  const showShadeRef = ref(true)

  const shadeStyle = ref<CSSProperties>({})

  function calcShade() {
    const shadeVal = unref(shade)
    console.log(shadeVal)
    if (shadeVal !== false) {
      showShadeRef.value = true
      if (shadeVal.length === 1) {
        shadeStyle.value = {
          opacity: shadeVal[0]
        }
      } else {
        const [opacity, backgroundColor] = shadeVal
        shadeStyle.value = {
          backgroundColor: backgroundColor as string,
          opacity
        }
      }
    } else {
      showShadeRef.value = false
    }
  }

  // shade 变化时计算
  watch(shade, () => {
    calcShade()
  })

  // 打开时计算(有一种场景为缩小后关闭,再次打开时, shade没有展示)
  watch(
    visible,
    (visibleVal) => {
      if (visibleVal) {
        calcShade()
      }
    },
    { immediate: true }
  )

  listenerShadeChange((shade) => {
    showShadeRef.value = shade
  }, false)

  return {
    shadeStyle,
    showShadeRef
  }
}
