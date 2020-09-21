<template>
<!-- Demo Website config -->
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <article class="tile is-child box">
      <h1 class="title">
        Demo Website
      </h1>
      <div v-if="!verticals.length">
        Loading...
      </div>
      <div class="content" v-if="verticals.length">
        <p>
          Choose the vertical and multichannel provider you want to use, 
          then click Go to Demo Website to show the customer side of the
          demo.
        </p>
        <b-field>
          <b-field style="margin-right: 1em;">
            <b-select 
            v-model="vertical" 
            @change.native="verticalChanged" 
            :disabled="working.app.user"
            >
              <option value="" disabled selected>
                Choose Your Demo Vertical
              </option>
              <option
              v-for="(brand, index) in systemBrands" 
              :value="brand.id"
              :key="'system' + index"
              >
                {{ `${brand.name} (${brand.id})` }}
              </option>
              <option disabled>-----------------------------------------</option>
              <option
              v-if="brandFilter === 'all'"
              v-for="(brand, index) in userBrands"
              :value="brand.id"
              :key="'user' + index"
              >
                {{ `${brand.name} (${brand.id})` }}
              </option>
              <option
              v-if="brandFilter === 'mine'"
              v-for="(brand, index) in myBrands"
              :value="brand.id"
              :key="'mine' + index"
              >
                {{ `${brand.name} (${brand.id})` }}
              </option>
              <option
              v-if="brandFilter === 'other'"
              v-for="(brand, index) in filteredSortedBrands"
              :value="brand.id"
              :key="'other' + index"
              >
                {{ `${brand.name} (${brand.id})` }}
              </option>
            </b-select>
          </b-field>

          <!-- <b-field style="margin-right: 1em;">
            <b-select
            v-model="multichannel"
            @change.native="multichannelChanged"
            :disabled="working.app.user"
            >
              <option value="" disabled>Choose Your Multichannel Provider</option>
              <option value="ece">ECE</option>
              <option value="upstream">Upstream</option>
              <option value="sfdc">Salesforce</option>
            </b-select>
          </b-field> -->

          <b-field>
            <button class="button is-success" @click="clickGo" :disabled="working.app.user">Go to Demo Website</button>
          </b-field>
        </b-field>
        
        <b-field>
          <b-checkbox v-model="showMore">Show More</b-checkbox>
        </b-field>

        <b-field v-show="showMore">
          <div class="field">
            <div class="field">
              <b-radio
              v-model="brandFilter"
              v-if="user.admin"
              native-value="all"
              >
                Show all verticals
              </b-radio>
            </div>
            <div class="field">
              <b-radio
              v-model="brandFilter"
              native-value="mine"
              >
                Show my verticals
              </b-radio>
            </div>
            <div class="field">
              <b-radio
              v-model="brandFilter"
              native-value="other"
              >
                <span style="float: left;">Show this user's verticals:</span>
              </b-radio>

              <b-autocomplete
              v-model="ownerFilter"
              :data="autocompleteOwners"
              style="width: 20em;"
              >
                <template slot="empty">No results found</template>
              </b-autocomplete>
            </div>
          </div>
        </b-field>

        <p>
          Note: You can create and configure your own vertical on the
          <a href="/branding" target="brand-toolbox">
            <strong>Demo Branding Toolbox</strong>
          </a>.
        </p>
        <p>
          Use
          <a :href="cumulusDemoLink" target="cumulus">
            this demo website
          </a>
          for demonstrating cobrowse only.
        </p>
      </div>
    </article>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      ownerFilter: '',
      brandFilter: 'mine',
      vertical: '',
      multichannel: 'ece',
      showMore: false
    }
  },

  // mounted () {
  //   this.vertical = this.demoConfig.vertical
  // },

  computed: {
    ...mapGetters([
      'verticals',
      'working',
      'user',
      'brandDemoLink',
      'cumulusDemoLink',
      'demoConfig'
    ]),
    autocompleteOwners () {
      // all owners of all verticals
      const allOwners = this.verticals.map(v => v.owner)
      // unique owners list
      const uniqueOwners = Array.from(new Set(allOwners))
      // remove
      return uniqueOwners.filter((option) => {
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.ownerFilter.toLowerCase()) >= 0
      })
    },
    sortedBrands () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted brands`, e)
      }
    },
    systemBrands () {
      return this.sortedBrands.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    userBrands () {
      return this.sortedBrands.filter(v => v.owner && v.owner !== 'system' && v.owner !== null)
    },
    myBrands () {
      return this.sortedBrands.filter(v => v.owner === this.user.username)
    },
    filteredSortedBrands () {
      // filter to only show the brands owned by specified user
      return this.sortedBrands.filter(v => v.owner === this.ownerFilter)
    }
  },

  methods: {
    ...mapActions([
      'saveDemoConfig'
    ]),
    updateSelection () {
      const selectedVertical = this.sortedBrands.find(v => {
        return v.id === this.vertical
      })
      console.log('selectedVertical = ', selectedVertical)
      // is this selected vertical owned by someone else?
      if (selectedVertical && selectedVertical.owner !== 'system' &&
      selectedVertical.owner !== this.user.username) {
        // selected vertical owned by a user that is not this user
        this.brandFilter = 'other'
        this.ownerFilter = selectedVertical.owner
      }
    },
    multichannelChanged (e) {
      console.log('multichannel changed', e.target.value)
      // construct data body to send to API REST request
      const data = {
        multichannel: e.target.value
      }
      // save demo config for user
      this.saveDemoConfig({
        data,
        showNotification: false
      })
    },
    verticalChanged (e) {
      console.log('vertical selected:', e.target.value)
      // construct data body to send to API
      const data = {
        vertical: e.target.value
      }
      // save vertical
      this.saveDemoConfig({
        data,
        showNotification: false
      })
      // await this.loadDemoConfig(false)
    },
    clickGo (e) {
      console.log('user clicked button to go to demo website. going to', this.brandDemoLink)
      window.open(this.brandDemoLink, 'brand')
    }
  },

  watch: {
    verticals (val, oldVal) {
      this.updateSelection()
    },
    vertical (val, oldVal) {
      // console.log('vertical watcher: vertical changed:', val)
      // console.log('this.sortedbrands.length = ', this.sortedBrands.length)
      this.updateSelection()
    },
    user (val, oldVal) {
      // console.log('user watcher: user changed:', val)
    },
    demoConfig (val) {
      // console.log('demo config changed:', val)
      // copy vertical selection to the one in demo config
      this.vertical = val.vertical
      // copy multichannel selection option from demo config value
      this.multichannel = val.multichannel
    },
    ownerFilter () {
      this.brandFilter = 'other'
    }
  }
}
</script>
