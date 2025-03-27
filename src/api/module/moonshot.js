import base from '../base' // 导入接口域名列表

const moonshot = {
  getMessage(params) {
    return window.$vueApp.config.globalProperties.$http.post(
      `${base.local}/moonshot/get`,
      params,
      {
        nprogress: false,
        headers: {
          'Content-Type': 'multipart/form-data', // 通常库会自动设置
        },
      }
    )
  },
}

export default moonshot
