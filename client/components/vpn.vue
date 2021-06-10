<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">VPN</h1>
        <div class="content" style="position: relative;">
          <b-loading :active="working.user.password" :is-full-page="false" />
          <p>
            Connect your laptop to the demo session using AnyConnect:
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
              <strong>{{ vpnUsername }}</strong>
              <a @click="clickCopy(vpnUsername, 'VPN Username')">
                <b-icon icon="layers"></b-icon>
              </a>
            </li>
            <li>
              Password: <strong>Your chosen demo VPN password</strong>
            </li>
          </ul>
          <b-field>
            <b-button
            style="margin-left: 1rem;"
            type="is-primary"
            rounded
            @click="clickResetPassword"
            :disabled="working.user.password"
            >
              Reset VPN Password
            </b-button>
          </b-field>
          <p>
            Note: If you have any issues resolving DNS in the demo while using
            Windows, try rebooting Windows to resolve this issue.
          </p>
          <p>
            You can download the AnyConnect installer here:
          </p>
          <ul>
            <li>
              <a :href="links.windows" download>AnyConnect 4.10 for Windows</a>
              (Only the <strong>Core &amp; VPN</strong> component is necessary)
            </li>
            <li>
              <a :href="links.mac" download>AnyConnect 4.10 for Mac</a>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      links: {
        windows: 'https://mm-static.cxdemo.net/anyconnect-win-4.10.00093-predeploy-k9.zip',
        mac: 'https://mm-static.cxdemo.net/anyconnect-macos-4.10.00093-predeploy-k9.dmg'
      }
    }
  },

  computed: {
    ...mapGetters([
      'working',
      'links',
      'vpnAddress',
      'user',
      'copyToClipboard'
    ]),
    vpnUsername () {
      if (this.user.username.length > 20) {
        return this.user.username.slice(0, 20)
      } else {
        return this.user.username
      }
    }
  },

  methods: {
    ...mapActions([
      'resetPassword'
    ]),
    clickResetPassword () {
      this.$buefy.dialog.prompt({
        title: 'Reset Demo VPN Password',
        message: `Enter your new demo VPN password:`,
        type: 'is-success',
        confirmText: 'Submit',
        rounded: true,
        inputAttrs: {
          type: 'password'
        },
        onConfirm: (password) => {
          console.log('changing password...')
          this.resetPassword(password)
        }
      })
    },
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>
