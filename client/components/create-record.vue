<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <div class="tile box is-child">
        <b-loading :is-full-page="false" :active="isWorking" />
        <!-- account number -->
        <b-field
        label="Account Number"
        label-position="on-border"
        :message="accountNumberMessage"
        :type="accountNumberType"
        >
          <b-input v-model="accountNumber" />
        </b-field>

        <!-- first name -->
        <b-field
        label="First Name"
        label-position="on-border"
        :message="firstNameMessage"
        :type="firstNameType"
        >
          <b-input
          v-model="firstName"
          />
        </b-field>

        <!-- last name -->
        <b-field
        label="Last Name"
        label-position="on-border"
        :message="lastNameMessage"
        :type="lastNameType"
        >
          <b-input v-model="lastName" />
        </b-field>

        <!-- phone number -->
        <b-field
        label="Phone Number"
        label-position="on-border"
        :message="phoneMessage"
        :type="phoneType"
        >
          <b-input v-model="phone" />
        </b-field>

        <!-- overwrite -->
        <b-field>
          <b-checkbox v-model="overwrite">
            Delete Existing Contacts
          </b-checkbox> 
        </b-field>

        <!-- submit -->
        <div class="buttons" style="display: flex; justify-content: flex-end;">
          <b-button
          type="is-success"
          class="float: left;"
          @click="clickAdd"
          :disabled="isLoading || isWorking"
          >
            Add Outbound Record
          </b-button>
        </div>
      </div>
    </div>

    <div class="tile is-parent">
      <div class="tile box is-child">
        <b-collapse
        :aria-id="`campaign-${id}-dialing-info`"
        class="panel"
        animation="slide"
        >
          <div
          class="panel-heading"
          role="button"
          :aria-controls="`campaign-${id}-dialing-info`"
          >
            <strong>Dialing the Outbound Simulator</strong>
          </div>
          <div class="panel-block">
            <ul class="list">
              <li>1 followed by a 10-digit US phone number</li>
              <li>0 followed by any number of digits</li>
            </ul>
          </div>
        </b-collapse>

        <b-collapse
        :aria-id="`campaign-${id}-dialing-info`"
        class="panel"
        animation="slide"
        >
          <div
          class="panel-heading"
          role="button"
          :aria-controls="`campaign-${id}-dialing-info`"
          >
            <strong>Dialing a Real Phone</strong>
          </div>
          <div class="panel-block">
            <ul class="list">
              <li v-if="datacenter === 'RTP' || datacenter === 'SJC'">
                91 followed by a US phone number
              </li>
              <li v-if="datacenter === 'LON'">
                90 followed by a UK phone number
              </li>
              <li v-if="datacenter === 'SNG'">
                9 followed by a Singapore phone number
              </li>
            </ul>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    campaign: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      phone: '',
      firstName: '',
      lastName: '',
      accountNumber: '1234',
      overwrite: false
    }
  },

  mounted () {
    this.firstName = this.user.firstName
    this.lastName = this.user.lastName
  },

  computed: {
    ...mapGetters([
      'loading',
      'working',
      'dialingRecordsErrors',
      'user',
      'datacenter'
    ]),
    id () {
      try {
        return this.campaign.refURL.split('/').pop()
      } catch (e) {
        return null
      }
    },
    isLoading () {
      return this.loading.campaign[this.id]
    },
    isWorking () {
      return this.working.campaign[this.id]
    },
    phoneType () {
      return this.phoneMessage ? 'is-danger' : ''
    },
    firstNameType () {
      return this.firstNameMessage ? 'is-danger' : ''
    },
    lastNameType () {
      return this.lastNameMessage ? 'is-danger' : ''
    },
    accountNumberType () {
      return this.accountNumberMessage ? 'is-danger' : ''
    },
    phoneMessage () {
      return this.getErrorDetail('Phone01')
    },
    firstNameMessage () {
      return this.getErrorDetail('FirstName')
    },
    lastNameMessage () {
      return this.getErrorDetail('LastName')
    },
    accountNumberMessage () {
      return this.getErrorDetail('AccountNumber')
    },
    errorData () {
      try {
        return this.dialingRecordsErrors[this.id]
      } catch (e) {
        return []
      }
    },
    formData () {
      // build header
      let data = 'AccountNumber,FirstName,LastName,Phone01'
      data += '\r\n'

      // add content
      data += this.accountNumber + ','
      data += this.firstName + ','
      data += this.lastName + ','
      data += this.phone
      data += '\r\n'
      return data
    }
  },

  methods: {
    ...mapActions([
      'addDialingRecords'
    ]),
    clickAdd () {
      this.addDialingRecords({
        id: this.id,
        records: this.formData,
        overwrite: this.overwrite
      })
    },
    getErrorDetail (name) {
      try {
        const error = this.errorData.find(v => v.errorDetail.error.errorData === name)
        return error.errorDetail.error.errorMessage
      } catch (e) {
        return null
      }
    }
  }
}
</script>

<style scoped>
ul.list {
  list-style: initial !important;
}
ul.list li {
  margin-left: 1rem;
}
</style>
