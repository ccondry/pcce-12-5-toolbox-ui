import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy'
import pkg from '../../../package.json'

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  sessionId: '',
  datacenter: '',
  apiVersion: 'Loading...',
  authApiVersion: 'Loading...'
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  },

  [types.SET_API_VERSION] (state, data) {
    state.apiVersion = data.version
  },

  [types.SET_AUTH_API_VERSION] (state, data) {
    state.authApiVersion = data.version
  }
}

const getters = {
  uiVersion: () => pkg.version,
  apiVersion: state => state.apiVersion,
  authApiVersion: state => state.authApiVersion
}

const actions = {
  async getApiVersion ({getters, dispatch}) {
    dispatch('setLoading', {group: 'app', type: 'apiVersion', value: true})
    console.log('loading API server info...')
    try {
      const endpoint = getters.endpoints.version
      console.log('loading API server info endpoint', endpoint, '...')
      const response = await dispatch('loadToState', {
        name: 'get API server version',
        endpoint,
        mutation: types.SET_API_VERSION,
        showNotification: false
      })
      console.log('load API server info - response:', response)
    } catch (e) {
      console.log('error loading API server info', e)
      // dispatch('errorNotification', {title: 'Failed to load API server info', error: e})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'apiVersion', value: false})
    }
  },
  async getAuthApiVersion ({getters, dispatch}) {
    dispatch('setLoading', {group: 'app', type: 'authApiVersion', value: true})
    const operation = 'auth API server version'
    console.log('getting', operation, '...')
    try {
      const endpoint = getters.endpoints.authApiVersion
      console.log('getting', operation, 'endpoint', endpoint, '...')
      const response = await dispatch('loadToState', {
        name: 'get' + operation,
        endpoint,
        mutation: types.SET_AUTH_API_VERSION,
        showNotification: false
      })
      console.log('get', operation, '- response:', response)
    } catch (e) {
      console.log('error getting', operation, e)
      // dispatch('errorNotification', {title: 'Failed to get ' + operation, error: e})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'authApiVersion', value: false})
    }
  },
  copyToClipboard (options, {string, type = 'Text'}) {
    console.log('copyToClipboard', type, string)
    // copy text to clipboard
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.value = string
    // input.focus()
    input.select()
    // console.log('input field', input)
    // const range = document.createRange()
    // range.selectNode(input)
    // window.getSelection().addRange(range)
    // console.log('range', range)
    const result = document.execCommand('copy')
    if (result === 'unsuccessful') {
      // failed
      console.error('Failed to copy text.')
    } else {
      // success
      // this.$snackbar.open({
      //   message: 'Text Copied',
      //   type: 'is-success',
      //   position: 'is-top'
      // })
      Toast.open({
        // duration: 5000,
        // message: `load brands failed`,
        // position: 'is-bottom',
        // type: 'is-danger'
        message: type + ' Copied to Your Clipboard',
        queue: false
      })
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
    window.getSelection().removeAllRanges()
    // remove the input field
    input.remove()
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
