import type { App } from 'vue'
import TButton from './components/TButton/TButton.vue'
import VLayer from './components/Layer/VLayer.vue'
import VLayerToolTip from './components/Layer/components/LayToolTip/LayToolTip.vue'
const components = {
  TButton,
  VLayer,
  VLayerToolTip
}

export default {
  install: (app: App) => {
    Object.keys(components).forEach((component) => {
      app.component(component, components[component])
    })
  }
}

export { TButton, VLayer, VLayerToolTip }
