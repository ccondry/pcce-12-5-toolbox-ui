import * as types from '../mutation-types'
import { post, load } from '../../utils'
import {
  ToastProgrammatic as Toast,
  DialogProgrammatic as Dialog
} from 'buefy'

const state = {
  status: null
}

const getters = {
  provisionStatus: state => state.status,
  isProvisioned: state => state.status !== null && Object.keys(state.status).length > 0,
  provisioningDisabled: (state, getters) => {
    if (getters.instance) {
      return getters.instance.locked
    } else {
      // disable provisioning if instance is not found
      return true
    }
  }
}

const mutations = {
  [types.SET_PROVISION_STATUS] (state, data) {
    state.status = data
  }
}

const actions = {
  async getProvisionStatus ({getters, commit, dispatch}, showNotification = false) {
    dispatch('setLoading', {group: 'user', type: 'provision', value: true})
    console.log('loading provision status...')
    try {
      const endpoint = getters.endpoints.provision
      console.log('loading provision status from endpoint', endpoint, '...')
      const response = await load(getters.instanceName, getters.jwt, endpoint)
      console.log('load provision status - response:', response)
      commit(types.SET_PROVISION_STATUS, response.data)
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded provision status')
      }
    } catch (e) {
      console.log('error loading provision status', e)
      dispatch('errorNotification', {title: 'Failed to load provision status', error: e})
    } finally {
      dispatch('setLoading', {group: 'user', type: 'provision', value: false})
    }
  },
  async provisionUser ({getters, commit, dispatch}, {password, showNotification = true}) {
    dispatch('setWorking', {group: 'user', type: 'provision', value: true})
    console.log('starting PCCE provision...')
    try {
      // now provision using their chosen VPN password
      await post(getters.instanceName, getters.jwt, getters.endpoints.provision, null, {password})
      // register provision status with pcce-toolbox-proxy
      // TODO get that static string out of there!
      const query = {demo: 'pcce', version: '12.5v1'}
      post(getters.instanceName, getters.jwt, getters.endpoints.provisionRegister, null, query)
      .catch(e => {
        console.log('failed to register provision information:', e.message)
      })
      // get new status
      dispatch('getProvisionStatus', {showNotification: false})
      Toast.open({
        message: `Provisioning successful`,
        type: 'is-success'
      })
      Dialog.confirm({
        message: `Your account has been provisioned successfully, however
        email routing will not function for your account until after 
        midnight local datacenter time.`
      })
    } catch (e) {
      console.log('error during PCCE provision script', e)
      Toast.open({
        message: `PCCE provision failed: ${e.message}`,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: 'provision', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
