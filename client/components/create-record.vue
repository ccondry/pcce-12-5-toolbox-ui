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
        <p class="subtitle">
          Outbound Dialing Information
        </p>
        <p>For US numbers...</p>
        <p>For UK numbers...</p>
        <p>For APJ numbers...</p>
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
      'user'
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
