/*
 * @Author: sanghangning
 * @Date: 2019-12-11 10:48:06
 * @Last Modified by: sanghangning
 * @Last Modified time: 2021-06-02 10:10:09
 */

import Empty from '@/components/common/Empty.vue'

const components = {
  install: function (Vue) {
    window.$vueApp.component('Empty', Empty)
  },
}

export default components
