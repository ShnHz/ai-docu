import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// modules
import common from './modules/common'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    common
  },
})