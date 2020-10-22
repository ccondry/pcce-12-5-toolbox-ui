<template>
  <div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Welcome</h1>
          <b-field>
            <p>
              Welcome to the Cisco Packaged Contact Center Enterprise 12.0 Demo
              on dCloud.
            </p>
          </b-field>
          <b-field>
            <p>
              Click this button to get support, ask questions, and suggest
              new features:
            </p>
          </b-field>
          <b-field>
            <button class="button is-success" @click.prevent="showDialog" >
              Join Support Room
            </button>
          </b-field>
        </article>
      </div>
    </div>

    <div v-if="loading.user.provision">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Loading...</h1>
          </article>
        </div>
      </div>
    </div>

    <div v-if="!loading.user.provision">
      <!-- done loading -->
      <div class="tile is-ancestor" v-if="!isProvisioned">
        <!-- user not provisioned - show provision button -->
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <!-- provisioning is not enabled for this instance -->
            <div v-if="provisioningDisabled">
              <p>
                Provisioning is currently disabled in this instance. Please try using
                another dCloud datacenter at this time.
              </p>
            </div>
            <!-- provisioning is enabled for this instance -->
            <div v-if="!provisioningDisabled">
              <h1 class="title">Start</h1>
              <b-field>
                <p>
                  Your account is not provisioned for this demo yet. Would you like
                  to provision it now?
                </p>
              </b-field>
              <b-field>
                <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
                  {{ working.user.provision ? `Working - ${provisionTime}` : 'Yes, Provision Me' }}
                </button>
              </b-field>
            </div>
          </article>
        </div>
      </div>

      <!-- user is provisioned - show agent info -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">VPN</h1>
            <div class="content">
              <p>
                You can connect your laptop to the demo session using AnyConnect:
              </p>
              <ul>
                <li>
                  Address:
                  <strong>{{ vpnAddress }}</strong>
                  <a @click="clickCopy(vpnAddress, 'VPN Address')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
                <li>
                  Username:
                  <strong>{{ user.username }}</strong>
                  <a @click="clickCopy(user.username, 'VPN Username')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
                <li>
                  Password: <strong>C1sco12345</strong>
                  <a @click="clickCopy('C1sco12345', 'VPN Password')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
              </ul>
              <p>
                Note: If you have any issues resolving DNS in the demo while using
                Windows, try rebooting Windows to resolve this issue.
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- Workstation -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Workstation</h1>
            <div class="content">
              <p>
                After you have connected to the demo session VPN,
                you can connect to the Workstation using Microsoft Remote Desktop
                Client to run your demos.
              </p>
              <p>
                If you have any issues connecting to
                the Workstation using the FQDN, then you can either try using the
                IP address instead, or if you are on Windows try rebooting Windows
                to resolve this AnyConnect-related DNS issue.
              </p>
              <p>
                Remote Desktop Workstation Address:
                <strong>{{ rdpAddress }}</strong>
                <a @click="clickCopy(rdpFqdn, 'Workstation RDP Address')"><b-icon icon="layers"></b-icon></a>
              </p>
              <p>
                <!-- Remote Desktop Workstation Credentials: -->
                Connect to the Workstation using your agents' credentials below.
                <!-- you can have more than 1 -->
                Create a separate connection profile in Microsoft Remote Desktop
                application to have multiple simultaneous agent desktops open
                (i.e. agent, supervisor).
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- user is provisioned - show agent info -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent">
          <article class="tile is-child box is-horizontal">
            <h1 class="title">Agents and Supervisors</h1>
            <div class="content">
              <agents :user="user" />
            </div>
          </article>
        </div>
      </div>

      <demo-website
      v-if="isProvisioned"
      />

      <!-- Mobile App -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">dCloud CC Mobile App Settings</h1>
            <div class="content">
              <p>
                Use this information to start the dCloud CC mobile app demo. The
                pod ID needs to be entered into the Settings screen in order for
                any demo customization to take effect with the mobile chat bot.
              </p>
              <ul>
                <li>Session: <strong>{{ sessionId }}</strong></li>
                <li>Datacenter: <strong>{{ datacenterDisplayName }}</strong></li>
                <li>Pod ID: <strong>{{ user.id }}</strong></li>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <!-- Whatsapp -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Whatsapp</h1>
            <div class="content">
              <p>
                Use the dCloud CC mobile app to place a call or start a chat
                before using the Whatsapp demo. This will put your contact info
                into the database for the chat bot to identify you on Whatsapp.
                This needs to be done again if you haven't used this demo for one week.
              </p>
              <p>
                Send "<strong>{{ whatsappJoinMessage }}</strong>" to
                <strong>{{ whatsappPhoneNumber }}</strong> using Whatsapp,
                or scan this QR code to do it automatically:
              </p>
              <img :src="whatsappQrUrl" />
            </div>
          </article>
        </div>
      </div>

      <!-- Facebook -->
      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Cumulus Facebook Page</h1>
            <div class="content">
              <p>
                Use these links to access the Cumulus Facebook for the AI/Chat Bot
                demo.
              </p>
              <ul>
                <li>
                  Facebook Page:
                  <strong>
                    <a :href="facebookLink" target="facebook">{{ facebookLink }}</a>
                  </strong>
                </li>
                <li>
                  Messenger Link: 
                  <strong>
                    <a :href="messengerLink" target="messenger">{{ messengerLink }}</a>
                  </strong>
                </li>
                <li>
                  Session: <strong>{{ sessionId }}</strong>
                  <a @click="clickCopy(sessionId, 'Session ID')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
                <li>
                  Datacenter: <strong>{{ datacenter }}</strong>
                  <a @click="clickCopy(datacenter, 'Datacenter')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
                <li>
                  User ID: <strong>{{ user.id }}</strong>
                  <a @click="clickCopy(user.id, 'User ID')">
                    <b-icon icon="layers"></b-icon>
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">CCE Web Administration (SPOG)</h1>
            <div class="content">
              <p>
                You can view and manage your PCCE department in
                <a href="https://ccedata.dcloud.cisco.com/cceadmin/" target="cceadmin">
                  CCE Web Administration (SPOG)
                </a>.
                You must be on the Workstation and/or the VPN to access SPOG.
              </p>
              <p>
                Your department administrator credentials for SPOG are:
                <ul>
                  <li>
                    URL:
                    <strong>
                      <a href="https://ccedata.dcloud.cisco.com/cceadmin/" target="cceadmin">
                        https://ccedata.dcloud.cisco.com/cceadmin/
                      </a>
                    </strong>
                  </li>
                  <li>
                    Username:
                    <strong>
                      {{ user.username }}@{{ ldapDomain }}
                      <a @click="clickCopy(`${user.username}@${ldapDomain}`, 'SPOG Username')">
                        <b-icon icon="layers"></b-icon>
                      </a>
                    </strong>
                  </li>
                  <li>
                    Password: <strong>C1sco12345</strong>
                    <a @click="clickCopy('C1sco12345', 'VPN Password')">
                      <b-icon icon="layers"></b-icon>
                    </a>
                  </li>
                </ul>
              </p>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">CUIC Reporting</h1>
            <div class="content">
              <p>
                Log in to
                <a href="https://cuic1.dcloud.cisco.com" target="cuic">
                  CUIC
                </a>
                using your main supervisor agent credentials, listed below. You must be
                on the Workstation and/or the VPN to access the CUIC server.
              </p>
              <ul>
                <li>URL: <strong><a href="https://cuic1.dcloud.cisco.com" target="cuic">https://cuic1.dcloud.cisco.com</a></strong></li>
                <li>Username:
                  <strong>
                    rbarrows{{ user.id }}
                    <a @click="clickCopy(`rbarrows${user.id}`, 'CUIC Username')">
                      <b-icon icon="layers"></b-icon>
                    </a>
                  </strong>
                </li>
                <li>
                  Password:
                  <strong>
                    C1sco12345
                    <a @click="clickCopy(`C1sco12345`, 'CUIC Password')">
                      <b-icon icon="layers"></b-icon>
                    </a>
                  </strong>
                </li>
                <li>
                  Login Type:
                  <strong>
                    LDAP
                  </strong>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="isProvisioned">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Outbound Campaigns</h1>
            <campaigns />
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="isProvisioned">
        <!-- user not provisioned - show provision button -->
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Reprovision</h1>
            <b-field>
              <p>
                Your account is already provisioned for this demo, but you can
                run it again if you need to. Would you like to provision again
                anyway?
              </p>
            </b-field>
            <b-field>
              <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
                {{ working.user.provision ? `Working - ${provisionTime}` : 'Yes, Provision Me Anyway' }}
              </button>
            </b-field>
          </article>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Agents from '../../components/agents.vue'
import moment from 'moment'
import DemoWebsite from '../../components/demo-website'
import Campaigns from '../../components/campaigns'

export default {
  components: {
    Agents,
    DemoWebsite,
    Campaigns
  },

  data () {
    return {
      timerEnd: 0,
      timerNow: 0,
      whatsappJoinMessage: 'join malachite-stork',
      whatsappPhoneNumber: '+1 (415) 523-8886',
      whatsappQrUrl: 'https://mm-static.cxdemo.net/whatsapp-qr.png'
    }
  },

  mounted () {
    // // find the currently selected vertical
    // const selectedVertical = this.sortedBrands.find(v => {
    //   return v.id === this.vertical
    // })
    // // is this selected vertical owned by someone else?
    // if (
    //   selectedVertical &&
    //   selectedVertical.owner !== 'system' &&
    //   selectedVertical.owner !== this.user.username
    // ) {
    //   // set the brand filter to proper value
    //   this.brandFilter = 'other'
    //   // set the owner filter to match the brand we loaded
    //   this.ownerFilter = selectedVertical.owner
    // }
    // make sure the selected vertical is displayed in the list
    const vertical = this.verticals.find(v => v.id === this.vertical)
    if (vertical && vertical.owner !== this.user.username && vertical.owner !== 'system') {
      // set the owner filter to the selected value
      this.ownerFilter = vertical.owner
      this.brandFilter = 'other'
    }
  },

  methods: {
    ...mapActions([
      'inviteToSupportRoom',
      'getProvisionStatus',
      'provisionUser',
      'copyToClipboard'
    ]),
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    },
    startTimer () {
      // advance the timer every 1 second
      setInterval(() => {
        this.timerNow = new Date().getTime()
      }, 1000)
    },
    showDialog (event) {
      // show dialog
      this.$buefy.dialog.prompt({
        title: 'Join the Webex Teams support room',
        message: `What is your Webex Teams email address?`,
        type: 'is-success',
        confirmText: 'Join',
        inputAttrs: {
          placeholder: 'username@example.com',
          value: this.user.email
        },
        onConfirm: (email) => {
          this.inviteToSupportRoom({email})
        }
      })
    },
    async clickProvision () {
      // reprovision or first time?
      if (this.isProvisioned) {
        // reprovision
        // set timer for working estimate
        // 45 seconds in milliseconds
        this.timerEnd = new Date().getTime() + 45 * 1000
        this.startTimer()
      } else {
        // first provision
        // set timer for working estimate
        // 60 seconds in milliseconds
        this.timerEnd = new Date().getTime() + 60 * 1000
        this.startTimer()
      }
      console.log('user clicked Provision Me button')
      // TODO prompt user if they are already provisioned in another active
      // datacenter
      try {
        await this.provisionUser()
        this.$buefy.dialog.confirm({
          message: `Your account has been provisioned successfully, however
          email routing will not function for your account until after 
          midnight local datacenter time.`
        })
      } catch (e) {
        console.log('error awaiting provisionUser:', e.message)
      }
    },
    getDid (name) {
      try {
        return this.dcloudSession.dids.find(v => v.name === name).number
      } catch (e) {
        return ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'isProvisioned',
      'loading',
      'working',
      'verticals',
      'dcloudSession',
      'provisioningDisabled',
      'rdpAddress',
      'rdpFqdn',
      'vpnAddress',
      'ldapDomain',
      'sessionId',
      'datacenter'
    ]),
    datacenterMidnight () {
      const m = moment()
      if (this.datacenter === 'RTP') {
        // GMT -5/-6
        // return m
      } else if (this.datacenter === 'SJC') {
        // GMT -8
      } else if (this.datacenter === 'LON') {
        // GMT?
      } else if (this.datacenter === 'SNG') {
        // GMT +6?
      } else {
        // undefined datacenter?
      }
      return m
    },
    datacenterDisplayName () {
      const displayNames = {
        'RTP': 'US East',
        'SJC': 'US West',
        'LON': 'EMEAR',
        'SNG': 'APJ'
      }
      return displayNames[this.datacenter]
    },
    facebookLink () {
      return 'https://fb.com/103018720547240'
    },
    messengerLink () {
      return 'https://m.me/103018720547240'
    },
    timeLeft () {
      // returns the estimated time remaining to complete provisioning
      // const now = new Date().getTime()
      const timeLeft = this.timerEnd - this.timerNow
      return Math.ceil(timeLeft / 1000)
    },
    provisionTime () {
      if (this.timeLeft < 0) {
        return 'Almost done...'
      } else if (this.timeLeft > 500) {
        // validate sane output
        // over 500 is probably wrong... so say something else
        return `Estimating time remaining...`
      } else {
        return `About ${this.timeLeft} seconds remaining...`
      }
    },
    demoNumber () {
      switch (this.vertical) {
        case 'city': return this.getDid('DID5')
        case 'healthcare': return this.getDid('DID9')
        case 'utility': return this.getDid('DID10')
        case 'finance': return this.getDid('DID7')
        case 'travel': return this.getDid('DID8')
        default: return this.getDid('DID7')
      }
    },
    disableSave () {
      return false
    }
  }
}
</script>
