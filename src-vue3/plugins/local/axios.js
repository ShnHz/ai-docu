import axios from 'axios'
import * as Vue from 'vue'

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

window.$vueApp.config.globalProperties.$http = axios

export default axios
