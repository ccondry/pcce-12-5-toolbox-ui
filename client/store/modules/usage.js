import * as types from '../mutation-types'

const state = {
  usage: []
}

const getters = {
  usage: state => state.usage
}

const mutations = {
  [types.SET_USAGE] (state, data) {
    state.usage = data
  }
}

const actions = {
  async loadUsage ({getters, commit, dispatch}, {query, showNotification = true}) {
    dispatch('setLoading', {group: 'app', type: 'usage', value: true})
    try {
      await dispatch('loadToState', {
        name: 'usage',
        endpoint: getters.endpoints.usage,
        mutation: types.SET_USAGE,
        showNotification,
        query
      })
    } catch (e) {
      console.log('error loading usage', e)
      dispatch('errorNotification', {title: 'Failed to load usage', error: e})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'usage', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
