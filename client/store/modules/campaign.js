import * as types from '../mutation-types'
import { fetch } from '../../utils'
import { ToastProgrammatic as Toast } from 'buefy'
import Vue from 'vue'

const state = {
  campaigns: [],
  records: {},
  // pageInfo: {},
  errors: {}
}

const getters = {
  campaigns: state => state.campaigns,
  dialingRecords: state => state.records,
  // dialingRecordsPageInfo: state => state.pageInfo,
  dialingRecordsErrors: state => state.errors
}

const mutations = {
  [types.SET_CAMPAIGNS] (state, data) {
    // append id from refURL to each item
    state.campaigns = data.map(v => {
      return {
        ...v,
        id: v.refURL.split('/').pop()
      }
    })
  },
  [types.SET_DIALING_RECORDS] (state, data) {
    Vue.set(state.records, data.id, data.records)
    // Vue.set(state.pageInfo, data.id, data.pageInfo)
  },
  [types.SET_DIALING_RECORD_ERROR] (state, data) {
    Vue.set(state.errors, data.id, data.errors)
  }
}

const actions = {
  async listDialingRecords ({commit, dispatch, getters}, id) {
    console.log('listDialingRecords', id)
    dispatch('setLoading', {group: 'campaign', type: id, value: true})
    try {
      const url = `${getters.endpoints.campaign}/${id}/record`
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt,
          instance: getters.instanceName
        }
      }
      const response = await fetch(url, options)
      commit(types.SET_DIALING_RECORDS, {
        id,
        records: response
      })
    } catch (e) {
      Toast.open({
        message: 'Failed to get dialing records: ' + e.message,
        type: 'is-danger',
        duration: 12 * 1000
      })
    } finally {
      dispatch('setLoading', {group: 'campaign', type: id, value: false})
    }
  },
  async getCampaigns ({commit, dispatch, getters}) {
    dispatch('setLoading', {group: 'campaign', type: 'list', value: true})
    try {
      const url = getters.endpoints.campaign
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt,
          instance: getters.instanceName
        }
      }
      const campaigns = await fetch(url, options)
      console.log('get campaigns response:', campaigns)
      commit(types.SET_CAMPAIGNS, campaigns)
    } catch (e) {
      Toast.open({
        message: 'Failed to get campaigns: ' + e.message,
        type: 'is-danger',
        duration: 12 * 1000
      })
    } finally {
      dispatch('setLoading', {group: 'campaign', type: 'list', value: false})
    }
  },
  async addDialingRecords ({commit, dispatch, getters}, {id, records, overwrite}) {
    dispatch('setWorking', {group: 'campaign', type: id, value: true})
    try {
      const url = getters.endpoints.campaign + '/' + id + '/record'
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getters.jwt,
          instance: getters.instanceName
        },
        body: {
          records,
          overwrite
        }
      }
      await fetch(url, options)
      const rows = records.trim().match(/\n/g)
      const message = `Succesfully uploaded ${rows.length} dialing record${rows.length > 1 ? 's' : ''}`
      // success notification
      Toast.open({
        message,
        type: 'is-success'
      })
      // clear any errors
      commit(types.SET_DIALING_RECORD_ERROR, {
        id,
        errors: []
      })
      // refresh data
      dispatch('listDialingRecords', id)
    } catch (e) {
      console.log('addDialingRecords error', e.json)
      commit(types.SET_DIALING_RECORD_ERROR, {
        id,
        errors: e.json.apiError
      })
      Toast.open({
        message: 'Failed to add dialing record: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'campaign', type: id, value: false})
    }
  },
  async deleteDialingRecords ({dispatch, getters}, id) {
    dispatch('setWorking', {group: 'campaign', type: id, value: true})
    try {
      const url = getters.endpoints.campaign + '/' + id + '/record'
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + getters.jwt,
          instance: getters.instanceName
        }
      }
      await fetch(url, options)
      // refresh data
      dispatch('listDialingRecords', id)
    } catch (e) {
      Toast.open({
        message: 'Failed to delete dialing record: ' + e.message,
        type: 'is-danger',
        duration: 12 * 1000
      })
    } finally {
      dispatch('setWorking', {group: 'campaign', type: id, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
