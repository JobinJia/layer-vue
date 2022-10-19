import { makeDestructurable } from '@vueuse/core'
import type { CSSProperties } from 'vue'

export function getDomWidthAndHeight(domEl: HTMLElement) {
  const [domWidth, domHeight] = [domEl.offsetWidth, domEl.offsetHeight]
  return makeDestructurable({ domWidth, domHeight } as const, [domWidth, domHeight] as const)
}

export function getDomPosition(domEl: HTMLElement) {
  const rect = domEl.getBoundingClientRect()
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY

  return makeDestructurable({ left, top } as const, [left, top] as const)
}

export function getStyle(node: HTMLElement, name: keyof CSSProperties) {
  const style: CSSStyleDeclaration = window.getComputedStyle(node, null)
  // const val = style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name)
  return style.getPropertyValue(name)
}
