const isProduction = process.env.NODE_ENV === 'production'

let authUrlBase = '/api/v1/auth'
let urlBase = '/api/v1/pcce-12-5'
if (!isProduction) {
  // authUrlBase = 'http://localhost:3032/api/v1/auth'
  // through toolbox-proxy
  // urlBase = 'http://localhost:3053/api/v1/pcce-12-5'
  // direct to pcce-12-5-toolbox-api
  urlBase = 'http://localhost:3058/api/v1/pcce-12-5'
  // use production REST APIs
  authUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth'
  // urlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/pcce-12-5'
}

const endpoints = {
  // add REST API endpoints here
  login: authUrlBase + '/login',
  logout: authUrlBase + '/logout',
  admin: {
    users: authUrlBase + '/admin/users',
    user: authUrlBase + '/admin/user',
    userProvisionMap: authUrlBase + '/provision',
    su: authUrlBase + '/su'
  },
  userDemo: authUrlBase + '/user/demo',
  user: authUrlBase + '/user',
  lockUser: authUrlBase + '/lock',
  unlockUser: authUrlBase + '/unlock',
  addSupport: authUrlBase + '/add-support',
  removeSupport: authUrlBase + '/remove-support',
  provision: urlBase + '/provision',
  provisionRegister: authUrlBase + '/provision/register',
  instances: authUrlBase + '/instance',
  session: urlBase + '/session',
  vertical: urlBase + '/vertical',
  cumulus: urlBase + '/cumulus',
  finesse: {
    team: {
      layout: urlBase + '/finesse/team/layout'
    }
  },
  version: urlBase + '/version',
  authApiVersion: authUrlBase + '/version',
  campaign: urlBase + '/campaign',
  webex: authUrlBase + '/resource/joinPcceSupportRoom',
  // reset password
  password: urlBase + '/resource/password'
}

const state = {
  endpoints
}

const mutations = {
}

const getters = {
  endpoints: state => state.endpoints
}

const actions = {
}

export default {
  state,
  mutations,
  getters,
  actions
}
