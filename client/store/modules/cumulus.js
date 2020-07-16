import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy'

const state = {
  brands: [],
  verticals: [],
  demoConfig: {}
}

const getters = {
  brands: state => state.brands,
  verticals: state => state.verticals,
  demoConfig: state => state.demoConfig
}

const mutations = {
  [types.SET_BRANDS] (state, data) {
    state.brands = data
  },
  [types.SET_VERTICALS] (state, data) {
    state.verticals = data
  },
  [types.SET_DEMO_CONFIG] (state, data) {
    state.demoConfig = data
  }
}

const actions = {
  async loadBrands ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'app', type: 'brands', value: true})
    try {
      await dispatch('loadToState', {
        name: 'brands',
        endpoint: getters.endpoints.brand,
        mutation: types.SET_BRANDS,
        showNotification
      })
    } catch (e) {
      console.error('error loading brands', e)
      // notify user
      Toast.open({
        duration: 5000,
        message: `load brands failed`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'app', type: 'brands', value: false})
    }
  },
  async loadVerticals ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'app', type: 'verticals', value: true})
    try {
      await dispatch('loadToState', {
        name: 'verticals',
        endpoint: getters.endpoints.vertical,
        mutation: types.SET_VERTICALS,
        showNotification
      })
    } catch (e) {
      console.error('error loading verticals', e)
      // notify user
      Toast.open({
        duration: 5000,
        message: `load verticals failed`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'app', type: 'verticals', value: false})
    }
  },
  async loadDemoConfig ({getters, commit, dispatch}, showNotification = true) {
    console.log('loadDemoConfig running...')
    dispatch('setLoading', {group: 'session', type: 'config', value: true})
    try {
      await dispatch('loadToState', {
        name: 'load demo session configuration',
        endpoint: getters.endpoints.cumulus,
        mutation: types.SET_DEMO_CONFIG,
        showNotification
      })
    } catch (e) {
      console.log('error loading demo session configuration', e)
      // dispatch('errorNotification', {title: 'Failed to load demo session configuration', error: e})
      Toast.open({
        duration: 5000,
        message: `load demo session configuration failed`,
        // position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'session', type: 'config', value: false})
    }
  },
  async saveDemoConfig ({getters, commit, dispatch}, {data, showNotification = true}) {
    try {
      dispatch('setWorking', {group: 'app', type: 'user', value: true})
      await dispatch('postData', {
        name: 'save demo configuration',
        endpoint: getters.endpoints.cumulus,
        success: 'Demo configuration saved.',
        fail: 'Failed to save your demo configuration',
        data,
        showNotification
      })
    } catch (e) {
      console.error('error loading defaults', e)
      dispatch('errorNotification', {title: 'Failed to load user details', error: e})
    } finally {
      dispatch('setWorking', {group: 'app', type: 'user', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
