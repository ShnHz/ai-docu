import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// plugins
import // i18n
'./plugins'

// css
import '@css/result.scss'
import '@css/varuables.css'
import '@css/skeleton.css'

// api
import api from './api'
window.$vueApp.config.globalProperties.$api = api

// components
import components from './components/components'
window.$vueApp.use(components)

// mixin
import Mixins from './utils/mixins'
window.$vueApp.mixin(Mixins)

// prototype
window.$vueApp.config.globalProperties.$window = window
window.$vueApp.config.globalProperties.$document = document

window.$vueApp.config.devtools = true

Promise.all([
  loadDevPlugins(),
  // getUserInfo()
]).then(() => {
  // init
  window.$vueApp = Vue.createApp(App)
  window.$vueApp.mount('#app')
  window.$vueApp.config.globalProperties.routerAppend = (
    path,
    pathToAppend
  ) => {
    return path + (path.endsWith('/') ? '' : '/') + pathToAppend
  }
  window.$vueApp.use(store)
  window.$vueApp.use(router)
})

// 加载开发环境组件
async function loadDevPlugins() {
  if (process.env.NODE_ENV == 'development') {
    await import('./plugins/dev')
  }
}

// 获取用户信息
async function getUserInfo() {
  await window.$vueApp.config.globalProperties.$api.user
    .getUserInfo()
    .then((res) => {
      store.commit('setUserInfo', res.data.data)
    })
    .catch(function (error) {
      console.log(error)
    })
}
