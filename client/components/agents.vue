<template>
  <div>
    <div class="tile is-ancestor" style="flex-wrap: wrap;">
      <!-- <div class="tile"> -->
        <!-- repeat this tile for each agent -->
        <div class="tile is-parent" v-for="(agent, i) of agents" :key="i">
          <article class="tile is-child box" style="min-width: 24em;">

            <p class="title">{{ agent.name }}</p>
            <p class="subtitle">{{ agent.description }}</p>
            <img :src="agent.picture" width="128px">
            <p>
              <strong>RDP Username:
              {{ agent.rdpUsername }}
              </strong>
              <a @click="clickCopy(agent.rdpUsername, 'RDP Username')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Finesse Username:
              {{ agent.finesseUsername }}
              </strong>
              <a @click="clickCopy(agent.finesseUsername, 'Finesse Username')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Password:
              {{ agent.password }}
              </strong>
              <a @click="clickCopy(agent.password, 'Password')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Extension:
                {{ agent.extension }}
              </strong>
              <a @click="clickCopy(agent.extension, 'Extension')"><b-icon icon="layers"></b-icon></a>
            </p>
          </article>
        <!-- </div> -->

      </div>
    </div>
    <!-- <center>
    <b-field>
    <button class="button is-success" @click="clickPortal">Go to Webex Contact Center Portal</button>
  </b-field>
</center> -->

<input type="hidden" id="clipboard" :value="clipboard">

</div>
</template>


<script>
import {mapActions} from 'vuex'

export default {
  props: ['user'],

  data () {
    return {
      portalUrl: 'https://portal.ccone.net',
      clipboard: 'initial-value'
    }
  },

  computed: {
    agents () {
      return [
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/sandra.png',
          finesseUsername: 'sjeffers' + this.user.id,
          rdpUsername: 'dcloud\\sjeffers' + this.user.id,
          password: 'C1sco12345',
          extension: '1080' + this.user.id,
          name: 'Sandra Jefferson',
          role: 'Agent',
          description: 'Main Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/josh.png',
          finesseUsername: 'jopeters' + this.user.id,
          rdpUsername: 'dcloud\\jopeters' + this.user.id,
          password: 'C1sco12345',
          extension: '1081' + this.user.id,
          name: 'Josh Peterson',
          role: 'Agent',
          description: 'CRM Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/trudy.png',
          finesseUsername: 'trujones' + this.user.id,
          rdpUsername: 'dcloud\\trujones' + this.user.id,
          password: 'C1sco12345',
          extension: '1087' + this.user.id,
          name: 'Trudy Vere-Jones',
          role: 'Agent',
          description: 'CRM Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/owen.png',
          finesseUsername: 'oharvey' + this.user.id,
          rdpUsername: 'dcloud\\oharvey' + this.user.id,
          password: 'C1sco12345',
          extension: '1085' + this.user.id,
          name: 'Owen Harvey',
          role: 'Agent',
          description: 'Outbound Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/annika.png',
          finesseUsername: 'annika' + this.user.id,
          rdpUsername: 'dcloud\\annika' + this.user.id,
          password: 'C1sco12345',
          extension: '1086' + this.user.id,
          name: 'Annika Hamilton',
          role: 'Agent',
          description: 'Outbound Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/helen.png',
          finesseUsername: 'hliang' + this.user.id,
          rdpUsername: 'dcloud\\hliang' + this.user.id,
          password: 'C1sco12345',
          extension: '1083' + this.user.id,
          name: 'Helen Liang',
          role: 'Agent',
          description: 'UWF Agent'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/rick.png',
          finesseUsername: 'rbarrows' + this.user.id + '@dcloud.cisco.com',
          rdpUsername: 'dcloud\\rbarrows' + this.user.id,
          password: 'C1sco12345',
          extension: '1082' + this.user.id,
          name: 'Rick Barrows',
          role: 'Supervisor',
          description: 'Main Supervisor'
        },
        {
          picture: 'https://mm.cxdemo.net/static/images/cumulus/common/james.png',
          finesseUsername: 'jabracks' + this.user.id + '@dcloud.cisco.com',
          rdpUsername: 'dcloud\\jabracks' + this.user.id,
          password: 'C1sco12345',
          extension: '1084' + this.user.id,
          name: 'James Bracksted',
          role: 'Supervisor',
          description: 'UWF Supervisor'
        }
      ]
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickPortal (e) {
      // open agent portal in new tab, or same tab if they have it open already
      window.open(this.portalUrl, 'ccone')
    },
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>
