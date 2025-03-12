import Vue from 'vue'
import VueRouter from 'vue-router'
import common from './routers/common'
import demo from './routers/demo'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/index'
  },
  ...common,
  ...demo,
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router