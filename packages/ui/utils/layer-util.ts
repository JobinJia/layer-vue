import { Offset } from '../components/Layer/props'

export function getDrawerAnimationClass(offset: Offset, isClose: boolean = false) {
  const prefix = 'layer-drawer-anim layer-anim'
  let suffix = 'rl'
  if (offset === 'l') {
    suffix = 'lr'
  } else if (offset === 'r') {
    suffix = 'rl'
  } else if (offset === 't') {
    suffix = 'tb'
  } else if (offset === 'b') {
    suffix = 'bt'
  }
  return isClose ? `${prefix}-${suffix}-close` : `${prefix}-${suffix}`
}
