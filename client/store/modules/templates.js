import * as types from '../mutation-types'
import { load, put, formatUnicorn } from '../../utils'
import Vue from 'vue'

const state = {
  template: {},
  templates: []
}

const getters = {
  template: state => state.template,
  templates: state => state.templates
}

const mutations = {
  [types.SET_TEMPLATE] (state, data) {
    console.log('setting selected template object:', data)
    state.template = data
  },
  [types.SET_TEMPLATES] (state, params) {
    console.log('setting templates:', params)
    Vue.set(state.templates, params.type, params.data)
  }
}

const actions = {
  async saveTemplate ({getters, commit, dispatch}, data) {
    dispatch('setWorking', {group: 'templates', type: data.type, value: true})
    console.log('saving', data.type, 'template:', data.data)
    try {
      let endpoint = formatUnicorn(getters.endpoints.templates, data.type)
      if (data.id) {
        // if ID is specified, append to URL
        endpoint = endpoint + '/' + data.id
      }
      const response = await put(getters.instanceName, getters.jwt, endpoint, null, data)
      console.log('saved', data.type, 'template:', response)
      dispatch('successNotification', 'Successfully saved ' + data.type + ' template')
      // load updated template list
      dispatch('loadTemplates', {type: data.type, showNotification: false})
    } catch (e) {
      console.log('error saving', data.type, 'template', e)
      dispatch('notification', {
        title: 'Failed to save ' + data.type + ' template',
        message: e.response.data.message,
        type: 'danger'
      })
    } finally {
      dispatch('setWorking', {group: 'templates', type: data.type, value: false})
    }
  },
  async loadTemplates ({getters, commit, dispatch}, {type, showNotification = true}) {
    // get summarized list of templates
    dispatch('setLoading', {group: 'templates', type, value: true})
    console.log('loading', type, 'templates')
    try {
      const endpoint = formatUnicorn(getters.endpoints.templates, type)
      const response = await load(getters.instanceName, getters.jwt, endpoint)
      console.log('load', type, 'templates:', response)
      commit(types.SET_TEMPLATES, {type, data: response.data})
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded ' + type + ' templates')
      }
    } catch (e) {
      console.log('error loading branding templates', e)
      dispatch('errorNotification', {title: 'Failed to load ' + type + ' templates', error: e})
    } finally {
      dispatch('setLoading', {group: 'templates', type, value: false})
    }
  },
  async getTemplate ({getters, commit, dispatch}, {type, id, showNotification = true}) {
    // get full data for single template
    dispatch('setLoading', {group: 'templates', type, value: true})
    console.log('loading', type, 'templates')
    try {
      const endpoint = formatUnicorn(getters.endpoints.templates, type) + '/' + id
      console.log('getTemplate endpoint =', endpoint)
      const response = await load(getters.instanceName, getters.jwt, endpoint)
      console.log('load', type, 'template', id, ':', response)
      commit(types.SET_TEMPLATE, response.data)
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded ' + type + ' template ' + id)
      }
      return response.data
    } catch (e) {
      console.log('error loading', type, 'template', id, ':', e)
      dispatch('errorNotification', {title: 'Failed to load ' + type + ' template ' + id, error: e})
    } finally {
      dispatch('setLoading', {group: 'templates', type, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
