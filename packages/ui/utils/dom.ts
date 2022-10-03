import { makeDestructurable } from '@vueuse/core'

export function getDomWidthAndHeight(domEl: HTMLElement) {
  const [domWidth, domHeight] = [domEl.offsetWidth, domEl.offsetHeight]
  return makeDestructurable({ domWidth, domHeight } as const, [domWidth, domHeight] as const)
}
