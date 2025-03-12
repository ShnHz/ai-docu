/*
 * @Author: sanghangning 
 * @Date: 2019-12-11 10:47:55 
 * @Last Modified by: sanghangning
 * @Last Modified time: 2021-08-12 16:43:04
 */

//   // 判断非本地server时 http强制转换成https
// if (process.env.NODE_ENV !== 'development') {
//   let targetProtocol = "https:";

//   if (window.location.protocol != targetProtocol)
//     window.location.href = targetProtocol +
//     window.location.href.substring(window.location.protocol.length);
// }


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// plugins
import {
  // i18n
} from './plugins'


// css
import '@css/result.scss'
import '@css/varuables.css'
import '@css/skeleton.css'

// api
import api from './api';
Vue.prototype.$api = api;

// components
import components from './components/components'
Vue.use(components);

// mixin
import Mixins from './utils/mixins';
Vue.mixin(Mixins);

// prototype
Vue.prototype.$window = window
Vue.prototype.$document = document

// other
Vue.config.productionTip = false
Vue.config.devtools = true;

Promise.all([
  loadDevPlugins(),
  // getUserInfo()
]).then(() => {
  // init
  new Vue({
    router,
    store,
    // i18n,
    render: h => h(App)
  }).$mount('#app')
})

// 加载开发环境组件
async function loadDevPlugins() {
  if (process.env.NODE_ENV == 'development') {
    await import('./plugins/dev')
  }
}

// 获取用户信息
async function getUserInfo() {
  await Vue.prototype.$api.user.getUserInfo().then((res) => {
    store.commit('setUserInfo', res.data.data)
  }).catch(function (error) {
    console.log(error)
  })
}