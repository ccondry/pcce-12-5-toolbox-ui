<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="!authCheckDone" :can-cancel="false"></b-loading>
    <div v-if="authenticated">
      <!-- endpoints have not finished loading yet -->
      <b-loading :is-full-page="true" :active="!authCheckDone" :can-cancel="false"></b-loading>
      <div v-if="authCheckDone" style="min-height: calc(100vh - 1.6em);">
        <nprogress-container></nprogress-container>
        <navbar :show="true" :menu-filter.sync="menuFilter"></navbar>
        <sidebar :show="sidebar.opened && !sidebar.hidden" :menu-filter="menuFilter"></sidebar>
        <app-main></app-main>
      </div>
      <footer class="footer" style="margin-left: 220px; height: 1.6em; padding: 0; background-color: #ebebeb">
        <div class="content">
          <small style="padding-right: 2em; padding-left: 1em;">
            UI version {{ uiVersion }}
          </small>
          <small style="padding-right: 2em; padding-left: 1em;">
            API version {{ apiVersion }}
          </small>
          <small style="padding-right: 2em; padding-left: 1em;">
            Auth API version {{ authApiVersion }}
          </small>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import { Navbar, Sidebar, AppMain } from 'components/layout/'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      menuFilter: '',
      production: process.env.NODE_ENV === 'production',
      authCheckDone: false
    }
  },

  components: {
    Navbar,
    Sidebar,
    AppMain,
    NprogressContainer
  },

  beforeMount () {
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width - RATIO < WIDTH
        this.toggleDevice(isMobile ? 'mobile' : 'other')
        this.toggleSidebar({
          opened: !isMobile
        })
      }
    }

    // add event listeners for DOM events
    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)
  },

  mounted () {
    // start authentication checks
    this.authCheck()
    // get the auth API version info
    this.getAuthApiVersion()
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'authenticated',
      'loading',
      'endpoints',
      'isProvisioned',
      'instances',
      'instance',
      'uiVersion',
      'apiVersion',
      'authApiVersion'
    ])
  },

  methods: {
    ...mapActions([
      'toggleDevice',
      'toggleSidebar',
      'checkLogin',
      'getDcloudSession',
      'setJwt',
      'getProvisionStatus',
      'loadVerticals',
      'getInstances',
      'loadDemoConfig',
      'updateInstanceName',
      'getAuthApiVersion',
      'getApiVersion'
    ]),
    async authCheck () {
      try {
        // check the JWT in localstorage to see if the user is already logged in
        console.log('checking login...')
        await this.checkLogin()
        console.log('checking login done.')
        this.authCheckDone = true
        if (this.authenticated === false) {
          // user is not authenticated - send them to login
          if (this.production) {
            // production - redirect to login page
            window.location = '/auth/login?destination=' + window.location
          } else {
            // development - pop JWT form
            this.clickLogin()
          }
        } else {
          // user is authenticated
          // get instances of PCCE 12 demo
          this.getInstances()
          // set the instance using the current URL
          this.updateInstanceName()
        }
      } catch (e) {
        console.log('failed to get endpoints and check login:', e.message)
      }
    },
    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT to log in`,
        inputAttrs: {
          placeholder: 'JWT'
        },
        onConfirm: (value) => {
          this.setJwt(value)
        }
      })
    }
  },
  watch: {
    async authenticated (val, oldVal) {
      // if user goes from logged in to logged out, forward them to the login page
      if (oldVal === true && val === false) {
        if (this.production) {
          // production - redirect to login page
          window.location = '/auth/login?destination=' + window.location
        } else {
          // development - pop JWT form
          this.clickLogin()
        }
      }
    },
    isProvisioned (val, oldVal) {
      // if user is provisioned
      if (oldVal === false && val === true) {
        // get dcloud session info
        this.getDcloudSession(false)
        // and get verticals list
        this.loadVerticals(false)
        // and get user demo config
        this.loadDemoConfig(false)
      }
    },
    instance (val, oldVal) {
      if (val) {
        // instance found
        // now load provision status
        this.getProvisionStatus()
        // and load API version info
        this.getApiVersion()
      }
    }
  }
}
</script>

<style lang="scss">
// @import '~animate.css';
// .animated {
//   animation-duration: .377s;
// }

@import '~bulma';

$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';

html {
  background-color: whitesmoke;
}

.nprogress-container {
  position: fixed !important;
  width: 100%;
  height: 50px;
  z-index: 2048;
  pointer-events: none;

  #nprogress {
    $color: #48e79a;

    .bar {
      background: $color;
    }
    .peg {
      box-shadow: 0 0 10px $color, 0 0 5px $color;
    }

    .spinner-icon {
      border-top-color: $color;
      border-left-color: $color;
    }
  }
}
</style>
