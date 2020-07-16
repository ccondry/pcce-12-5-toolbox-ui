import * as types from './mutation-types'
import { load, put, post, httpDelete } from '../utils'

export const toggleSidebar = ({ commit }, data) => {
  if (data instanceof Object) {
    commit(types.TOGGLE_SIDEBAR, data)
  }
}

export const toggleDevice = ({ commit }, data) => commit(types.TOGGLE_DEVICE, data)

export const expandMenu = ({ commit }, data) => {
  if (data) {
    data.expanded = data.expanded || false
    commit(types.EXPAND_MENU, data)
  }
}

export const switchEffect = ({ commit }, data) => {
  if (data) {
    commit(types.SWITCH_EFFECT, data)
  }
}

export const loadToState = async function ({getters, commit, dispatch}, options) {
  if (!options.mutation) {
    const message = 'error during loadToState ' + options.name + ' - options.mutation was undefined. Verify that the mutation type constant is in mutation-types.js'
    console.log(message)
    return
    // throw Error(message)
  }
  try {
    const response = await load(getters.instanceName, getters.jwt, options.endpoint, options.query)
    console.log(`GET ${options.name}`, response)
    let data
    if (typeof options.transform === 'function') {
      data = options.transform(response)
    } else {
      data = response.data
    }
    commit(options.mutation, data)
    if (options.showNotification !== false) {
      dispatch('successNotification', `Successfully loaded ${options.name}`)
    }
    return response
  } catch (e) {
    console.error(`error during GET ${options.name}`, e)
    // check for 401 (expired JWT)
    // console.error('e.response', e.response)
    try {
      if (e.response.status === 401 && e.response.data.toLowerCase() === 'jwt expired') {
        // JWT expired
        console.log('JWT expired. logging out user locally.')
        dispatch('unsetJwt')
      }
    } catch (e2) {
      // continue
    }
    if (options.showNotification !== false) {
      dispatch('errorNotification', {title: `Failed to GET ${options.name}`, error: e})
    }
  }
}

export const setWorking = function ({getters, commit, dispatch}, {group, type, value = true}) {
  commit(types.SET_WORKING, {group, type, value})
}

export const setLoading = function ({getters, commit, dispatch}, {group, type, value = true}) {
  commit(types.SET_LOADING, {group, type, value})
}

export const putData = async function ({getters, commit, dispatch}, options) {
  try {
    console.log(`putData ${options.endpoint}`, options.data)
    const response = await put(getters.instanceName, getters.jwt, options.endpoint, options.query, options.data)
    console.log(`put ${options.name}`, response)
    if (options.showNotification) {
      dispatch('successNotification', `Successfully set ${options.name}`)
    }
    return response
  } catch (e) {
    console.log(`error during PUT ${options.name}`, e)
    dispatch('errorNotification', {title: `Failed to PUT ${options.name}`, error: e})
  }
}

export const postData = async function ({getters, commit, dispatch}, options) {
  try {
    console.log(`postData ${options.endpoint}`, options.data)
    const response = await post(getters.instanceName, getters.jwt, options.endpoint, options.query, options.data)
    console.log(`post ${options.name}`, response)
    if (options.showNotification) {
      dispatch('successNotification', `Successfully updated ${options.name}`)
    }
    let data
    // transform response data before commiting?
    if (typeof options.transform === 'function') {
      data = options.transform(response)
    } else {
      data = response.data
    }
    // commit data to state?
    if (options.mutation) {
      commit(options.mutation, data)
    }
    return response
  } catch (e) {
    console.log(`error during POST ${options.name}`, e)
    dispatch('errorNotification', {title: `Failed to POST ${options.name}`, error: e})
  }
}

export const deleteData = async function ({getters, commit, dispatch}, options) {
  try {
    console.log(`deleteData ${options.endpoint}`, options.data)
    const response = await httpDelete(getters.instanceName, getters.jwt, options.endpoint, options.query)
    console.log(`delete ${options.name}`, response)
    if (options.showNotification) {
      dispatch('successNotification', `Successfully deleted ${options.name}`)
    }
    return response
  } catch (e) {
    console.log(`error during DELETE ${options.name}`, e)
    dispatch('errorNotification', {title: `Failed to DELETE ${options.name}`, error: e})
  }
}
