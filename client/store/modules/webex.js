// import * as types from '../mutation-types'
import { post } from '../../utils'
import {ToastProgrammatic as Toast} from 'buefy'

const state = {
  // status: null
}

const getters = {
  // provisionStatus: state => state.status
}

const mutations = {
  // [types.SET_PROVISION_STATUS] (state, data) {
  //   state.status = data
  // }
}

const actions = {
  async inviteToSupportRoom ({getters, commit, dispatch}, {email, showNotification = true}) {
    // metadata
    const group = 'webex'
    const type = 'invite'
    const action = 'Add user to the PCCE 12.5 Demo Support Webex Teams room'
    // set working state on
    dispatch('setWorking', {group, type, value: true})
    console.log('starting', action, 'using email', email, '...')
    // REST API endpoint URL
    const endpoint = getters.endpoints.webex
    try {
      // send email in query string parameters
      await post(getters.instanceName, getters.jwt, endpoint, {personEmail: email})
      // show a Toast notification on success, if not disabled
      if (showNotification) {
        Toast.open({
          duration: 8000,
          message: `${action} successful.`,
          type: 'is-success'
        })
      }
    } catch (e) {
      console.log(action, 'failed:', e)
      // show a Toast notification on error
      Toast.open({
        duration: 14000,
        message: `${action} failed with this error: ` + e.response.data,
        type: 'is-danger'
      })
    } finally {
      // set working state off
      dispatch('setWorking', {group, type, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
