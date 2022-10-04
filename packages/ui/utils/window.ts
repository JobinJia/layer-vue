// 可视windows区域
export const windowViewWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
export const windowViewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// scrollTop
export function getWindowScroll() {
  const doc = document.documentElement
  const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  return {
    winScrollTop: top,
    winScrollLeft: left
  }
}
