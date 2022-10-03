import components from "./components";

export default {
  install: (app) => {
    Object.keys(components).forEach(component => {
      app.component(component, components[component]);
    })
  }
}
