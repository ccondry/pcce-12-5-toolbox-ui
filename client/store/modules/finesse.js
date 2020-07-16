import * as types from '../mutation-types'
import axios from 'axios'
import {load} from '../../utils'

const state = {
  useDefault: false,
  layoutXml: ''
}

const getters = {
  useDefault: state => state.useDefault,
  layoutXml: state => state.layoutXml
}

const mutations = {
  [types.SET_LAYOUT_XML] (state, data) {
    state.layoutXml = data
  },
  [types.SET_USE_DEFAULT] (state, data) {
    state.useDefault = data
  }
}

const actions = {
  updateLayoutEditor ({commit}, data) {
    const layoutXml = data.TeamLayoutConfig.layoutxml.replace(/&amp;/g, '&')
    const useDefault = data.TeamLayoutConfig.useDefault === 'true'
    commit(types.SET_LAYOUT_XML, layoutXml)
    commit(types.SET_USE_DEFAULT, useDefault)
  },
  async getFinesseLayout ({state, getters, commit, dispatch}) {
    // set loading indicator
    dispatch('setLoading', {group: 'finesse', type: 'teamLayout', value: true})
    // load layout
    try {
      const endpoint = getters.endpoints.finesse.team.layout
      const response = await load(getters.instance, getters.jwt, endpoint, {})
      console.log('team layout loaded. response:', response)
      dispatch('updateLayoutEditor', response.data)
      // display notification
    } catch (error) {
      console.log(error)
      // display error notification
      dispatch('errorNotification', {
        title: 'Failed to load provision status',
        error
      })
    } finally {
      // set loading indicator
      dispatch('setLoading', {group: 'finesse', type: 'teamLayout', value: false})
    }
  },
  async saveTeamLayout ({state, getters, commit, dispatch}, data) {
    dispatch('setWorking', {group: 'finesse', type: 'teamLayout', value: true})
    console.log('saving team layout...', data)
    const options = {}
    if (getters.authEnabled === true) {
      const jwt = getters.jwt
      options.headers = {
        Authorization: 'Bearer ' + jwt
      }
    }
    const body = {
      TeamLayoutConfig: {
        layoutxml: data.layoutXml.replace(/&/g, '&amp;'),
        useDefault: data.useDefault
      }
    }
    try {
      // get the endpoint with string replacement to specify team ID
      const endpoint = getters.endpoints.finesse.team.layout
      await axios.put(endpoint, body, options)
      dispatch('successNotification', {
        title: `Finesse layout saved.`,
        message: ``
      })
      // load team layout from API again
      dispatch('loadTeamLayout', data.team)
    } catch (e) {
      console.log('failed to save team layout', e)
      const title = `Failed to save Finesse layout.`
      dispatch('errorNotification', {
        title,
        error: e.message
      })
    } finally {
      dispatch('setWorking', {group: 'finesse', type: 'teamLayout', value: false})
    }
  },
  updateLayoutXml ({commit}, data) {
    commit(types.SET_LAYOUT_XML, data)
  },
  updateUseDefault ({commit}, data) {
    commit(types.SET_USE_DEFAULT, data)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
