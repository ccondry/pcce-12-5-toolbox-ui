import * as types from '../mutation-types'
import { post } from '../../utils'

const state = {
  users: [],
  userProvisionMap: []
}

const getters = {
  users: state => state.users,
  userProvisionMap: state => state.userProvisionMap
}

const mutations = {
  [types.SET_USERS] (state, data) {
    state.users = data
  },
  [types.SET_USER_PROVISION_MAP] (state, data) {
    state.userProvisionMap = data
  }
}

const actions = {
  async updateUser ({getters, commit, dispatch}, {showNotification = true, user, body}) {
    const type = 'updateUser'
    try {
      dispatch('setWorking', {group: 'admin', type, value: true})
      const endpoint = getters.endpoints.admin.user + '/' + user.id
      // updating only the pcce-12-5 demo portion of user data from here
      await post(getters.instanceName, getters.jwt, endpoint, {demo: 'pcce-12-5'}, body)
      // reload new user data using JWT
      if (showNotification) {
        dispatch('successNotification', `Successfully updated user ${user.username}`)
      }
    } catch (e) {
      console.log(`error posting ${type}`, e)
      dispatch('errorNotification', {title: `Failed to update user ${user.username}`, error: e})
    } finally {
      dispatch('setWorking', {group: 'admin', type, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
