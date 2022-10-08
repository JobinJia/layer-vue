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

  const shadeStyle = ref<CSSProperties>({})

  function calcShade() {
    const shadeVal = unref(shade)
    if (shadeVal !== false) {
      if (shadeVal.length === 1) {
        shadeStyle.value = {
          opacity: shadeVal[0],
          display: 'block'
        }
      } else {
        const [opacity, backgroundColor] = shadeVal
        shadeStyle.value = {
          backgroundColor: backgroundColor as string,
          opacity,
          display: 'block'
        }
      }
    } else {
      shadeStyle.value = {
        opacity: shadeVal[0],
        display: 'none'
      }
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
    shadeStyle.value = {
      ...unref(shadeStyle),
      display: shade ? 'block' : 'none'
    }
  }, false)

  return {
    shadeStyle
  }
}
