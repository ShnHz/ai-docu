import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import common from './routers/common'
import demo from './routers/demo'

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  ...common,
  ...demo,
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

export default router
