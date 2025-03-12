import base from '../base' // 导入接口域名列表

const moonshot = {
  getMessage(params) {
    return window.$vueApp.config.globalProperties.$http.get(
      `${base.local}/moonshot/get`,
      {
        params: params,
        nprogress: false,
      }
    )
  },
}

export default moonshot
