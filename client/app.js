import Vue from 'vue'
import Buefy from 'buefy'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import * as types from 'vuex-store/mutation-types'

import 'buefy/dist/buefy.css'
// import 'vue-material-design-icons/styles.css'

Vue.use(Buefy)

Vue.router = router

Vue.use(NProgress)
// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((to, from, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(types.TOGGLE_SIDEBAR, false)
  }
  // console.log('from', from)
  // console.log('to', to)
  // is user logged out?
  if (state.auth.jwt === null) {
    // console.log('user is not logged in')
    // did they try to go to the Login page?
    // if (to.name === 'Login' || to.name === 'Password Reset') {
    //   // that's ok, they can go to the Login page or Password Reset page
    //   return next()
    // } else {
    //   // store the route they were going to
    //   if (to.name === 'Login') {
    //     // if they landed on the login page to begin with, forward them to the
    //     // home page after they login
    //     store.commit(FORWARD_TO, {path: '/home', fullPath: '/home'})
    //   } else {
    //     // after login, forward user to the route they tried to go to
    //     store.commit(FORWARD_TO, to)
    //   }
    //   // go to the Login page
    //   return router.push('Login')
    // }
    // continue
    next()
  } else {
    // user is logged in
    // console.log('user is logged in')
    // // going to / ?
    // if (to.path === '' || to.path === '/') {
    //   // send to /home
    //   return router.push('home')
    // }
    // continue
    next()
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
