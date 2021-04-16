import * as types from '../mutation-types'
// import axios from 'axios'
// import { load } from '../../utils'

const state = {
  user: {}
}

const getters = {
  user: state => state.user
}

const mutations = {
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

const actions = {
  async resetPassword ({dispatch, getters}, password) {
    return dispatch('fetch', {
      group: 'user',
      type: 'password',
      url: getters.endpoints.password,
      options: {
        method: 'POST',
        body: {
          password
        }
      },
      message: 'reset password',
      showNotification: true
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
