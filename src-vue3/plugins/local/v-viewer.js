import * as Vue from 'vue'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
window.$vueApp.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    button: false,
    title: false,
  },
})
