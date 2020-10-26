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
    state.campaigns = data
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
          Authorization: 'Bearer ' + getters.jwt
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
          Authorization: 'Bearer ' + getters.jwt
        }
      }
      const campaigns = await fetch(url, options)
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
  async addDialingRecord ({commit, dispatch, getters}, {id, records, overwrite}) {
    dispatch('setWorking', {group: 'campaign', type: id, value: true})
    try {
      const url = getters.endpoints.campaign + '/' + id + '/record'
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        },
        body: {
          records,
          overwrite
        }
      }
      await fetch(url, options)
      // clear any errors
      commit(types.SET_DIALING_RECORD_ERROR, {
        id,
        errors: []
      })
      // refresh data
      dispatch('listDialingRecords', id)
    } catch (e) {
      console.log('addDialingRecord error', e.json)
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
          Authorization: 'Bearer ' + getters.jwt
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
