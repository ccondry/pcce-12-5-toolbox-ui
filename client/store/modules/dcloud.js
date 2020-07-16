import * as types from '../mutation-types'

// const isProduction = process.env.NODE_ENV === 'production'

// pick the localhost instance if running in development mode
// const instanceName = isProduction ? 'RTP-1' : 'DEV-1'
// const instanceName = 'RTP-1'

const state = {
  session: null,
  instances: [],
  instanceName: ''
  // instance: {}
}

const mutations = {
  [types.SET_DCLOUD_SESSION] (state, data) {
    state.session = data
  },
  [types.SET_INSTANCES] (state, data) {
    state.instances = data
  },
  [types.SET_INSTANCE_NAME] (state, data) {
    state.instanceName = data
  }
}

const getters = {
  dcloudSession: state => {
    // console.log(state.session)
    return state.session || {}
  },
  sessionId: (state, getters) => getters.dcloudSession.sessionId,
  datacenter: (state, getters) => getters.dcloudSession.datacenter,
  brandDemoLink (state, getters) {
    return `https://mm-brand.cxdemo.net?session=${getters.instance.session}&datacenter=${getters.instance.datacenter}&userId=${getters.user.id}`
  },
  cumulusDemoLink (state, getters) {
    return `https://mm.cxdemo.net?session=${getters.instance.session}&datacenter=${getters.instance.datacenter}&userId=${getters.user.id}`
  },
  // all available instances
  instances: state => state.instances,
  // instance name, like RTP-1
  instanceName: state => state.instanceName,
  // full demo instance object
  instance: (state, getters) => {
    try {
      // get datacenter and instance ID
      const parts = getters.instanceName.split('-')
      console.log('parts', parts)
      // find this instance in the array of all availalble PCCE 12 instances
      const obj = getters.instances.find(v => {
        return v.datacenter === parts[0] && String(v.id) === parts[1]
      })
      console.log('instance is', obj)
      return obj || {}
    } catch (e) {
      return {}
    }
  },
  vpnAddress: (state, getters) => {
    try {
      return 'vpn-pcce-12-5-' + getters.datacenter.toLowerCase() + '.cxdemo.net'
    } catch (e) {
      // maybe getters.datacenter is not ready yet
      return 'Loading...'
    }
  },
  rdpAddress: (state, getters) => {
    return `${getters.rdpFqdn} (${getters.rdpIp})`
  },
  rdpIp: (state, getters) => {
    return '198.18.134.210'
  },
  rdpFqdn: (state, getters) => {
    return 'rdp.dcloud.cisco.com'
  }
}

const actions = {
  async getDcloudSession ({getters, commit, dispatch}, showNotification = true) {
    console.log('getDcloudSession...')
    dispatch('setLoading', {group: 'app', type: 'session', value: true})
    try {
      await dispatch('loadToState', {
        name: 'dcloud session info',
        endpoint: getters.endpoints.session,
        mutation: types.SET_DCLOUD_SESSION,
        showNotification
      })
    } catch (e) {
      console.error('error loading dcloud session info', e)
    } finally {
      dispatch('setLoading', {group: 'app', type: 'session', value: false})
    }
  },
  async getInstances ({getters, commit, dispatch}, showNotification = false) {
    console.log('getInstances...')
    dispatch('setLoading', {group: 'app', type: 'instances', value: true})
    try {
      await dispatch('loadToState', {
        name: 'pcce 12 instances',
        endpoint: getters.endpoints.instances,
        query: {
          demo: 'pcce',
          version: '12.0v2'
        },
        mutation: types.SET_INSTANCES,
        showNotification
      })
    } catch (e) {
      console.error('failed to get instances:', e.message)
      throw e
    } finally {
      dispatch('setLoading', {group: 'app', type: 'instances', value: false})
    }
  },
  setInstanceName ({commit}, data) {
    commit(types.SET_INSTANCE_NAME, data)
  },
  updateInstanceName ({getters, dispatch}) {
    console.log('updateInstanceName - isProduction =', getters.isProduction)
    if (getters.isProduction) {
      // get current hostname of the browser location
      const hostname = window.location.hostname
      console.log('updateInstanceName - hostame =', hostname)
      // get the part before ".cisco.com"
      const part1 = hostname.split('.').shift()
      // get the datacenter part
      const datacenter = part1.split('-').pop().toUpperCase()
      dispatch('setInstanceName', datacenter + '-1')
    } else {
      console.log('in development, so using RTP-1 instance.')
      dispatch('setInstanceName', 'RTP-1')
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
