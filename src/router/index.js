import Vue from 'vue'
import Router from 'vue-router'
import read from '@/pages/read'
import Ebook from '@/pages/ebook/index'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'read',
    component: read
  }, {
    path: '/Ebook',
    name: 'Ebook',
    component: Ebook
  }]
})
