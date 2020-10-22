<template>
  <div style="display: flex; flex-direction: column;">
    <!-- <pre>{{ paginationData }}</pre>
    <pre>{{ sortField }}</pre>
    <pre>{{ defaultSortOrder }}</pre> -->
    <section
    class="box"
    style="position:"
    >
      <!-- heading -->
      <div class="title">
        Contact Records
      </div>
      <div class="subtitle">
        {{ campaign.name }}
      </div>

      <!-- table -->
      <b-table
      :data="tableData"
      :loading="isLoading"
      :paginated="tableData.length > 15"
      :narrowed="true"
      :per-page="15"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      >

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <div v-if="isLoading && !tableData.length">
                <b-loading :is-full-page="false" :active="true" />
              </div>
              <div v-else>No contact records found.</div>
            </div>
          </section>
        </template>

        <b-table-column
        field="id"
        label="ID"
        sortable
        v-slot="props"
        >
          {{ props.row.id }}
        </b-table-column>

        <b-table-column
        field="accountNumber"
        label="Account Number"
        sortable
        v-slot="props"
        >
          {{ props.row.accountNumber }}
        </b-table-column>

        <b-table-column
        field="firstName"
        label="First Name"
        sortable
        v-slot="props"
        >
          {{ props.row.firstName }}
        </b-table-column>

        <b-table-column
        field="lastName"
        label="Last Name"
        sortable
        v-slot="props"
        >
            {{ props.row.lastName }}
        </b-table-column>

        <b-table-column
        field="phone01.number"
        label="Phone Number"
        sortable
        v-slot="props"
        >
          {{ props.row.phone01.number }}
        </b-table-column>

        <b-table-column
        field="callStatus"
        label="Status"
        sortable
        v-slot="props"
        >
          {{ props.row.callStatus }}
        </b-table-column>

        <b-table-column
        field="callsMade"
        label="Calls Made"
        sortable
        v-slot="props"
        >
          {{ props.row.callsMade }}
        </b-table-column>

        <b-table-column
        field="callResultOverall"
        label="Overall Result"
        sortable
        v-slot="props"
        >
          {{ props.row.callResultOverall }}
        </b-table-column>

      </b-table>
      <div class="buttons" style="display: flex; flex: 0 1; float: right; padding-top: 1rem;">
        <b-button
        type="is-info"
        @click="clickRefresh"
        :disabled="isLoading"
        >
          Refresh Records
        </b-button>
        <b-button
        @click="clickDelete"
        type="is-danger"
        :disabled="!tableData.length || isLoading || isWorking"
        >
        Delete All Records
        </b-button>
      </div>
    </section>

    <section class="box">
      <b-loading :is-full-page="false" :active="isWorking" />
      <p class="subtitle">
        Create Contact Record
      </p>
      
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
      <b-field
      label="Overwrite Previous Records"
      label-position="on-border"
      >
        <b-switch v-model="overwrite" />
      </b-field>

      <!-- submit -->
      <b-button
      type="is-success"
      @click="clickAdd"
      :disabled="isLoading || isWorking"
      >
        Add Outbound Record
      </b-button>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    campaign: {
      required: true
    }
  },

  mounted () {
    this.firstName = this.user.firstName
    this.lastName = this.user.lastName
    // this.listDialingRecords(this.id)
  },

  data () {
    return {
      phone: '',
      firstName: '',
      lastName: '',
      accountNumber: '1234',
      overwrite: false
      // sort: 'firstName asc'
    }
  },

  methods: {
    ...mapActions([
      'addDialingRecord',
      'listDialingRecords',
      'deleteDialingRecords'
    ]),
    getErrorDetail (name) {
      try {
        const error = this.errorData.find(v => v.errorDetail.error.errorData === name)
        return error.errorDetail.error.errorMessage
      } catch (e) {
        return null
      }
    },
    clickRefresh () {
      this.listDialingRecords(this.id)
    },
    clickDelete () {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete all ${this.tableData.length} contact records in ${this.campaign.name}?`,
        type: 'is-danger',
        onConfirm: () => {
          this.deleteDialingRecords(this.id)
        }
      })
    },
    // onPageChange (number) {
    //   // this.$buefy.toast.open('page ' + number)
    //   // change paginated data
    //   this.startIndex = (number - 1) * this.paginationData.resultsPerPage
    //   // refresh data
    //   this.getRecords()
    // },
    // onSort (field, order) {
    //   // sort on server side
    //   console.log('onSort', field, order)
    //   const fields = {
    //     'phone01.number': 'Phone01',
    //     'firstName': 'firstName',
    //     'lastName': 'lastName',
    //     'accountNumber': 'accountNumber'
    //   }
    //   this.sort = `${fields[field]} ${order}`
    //   // refesh data
    //   this.getRecords()
    // },
    getRecords () {
      this.listDialingRecords(this.id)
    },
    clickAdd () {
      this.addDialingRecord({
        id: this.id,
        records: this.formData,
        overwrite: this.overwrite
      })
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'dialingRecords',
      'dialingRecordsPageInfo',
      'dialingRecordsErrors',
      'loading',
      'working'
    ]),
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
    // sortField () {
    //   try {
    //     return this.paginationData.sortTerm.split(' ').shift()
    //   } catch (e) {
    //     return 'accountNumber'
    //   }
    // },
    // defaultSortOrder () {
    //   try {
    //     return this.paginationData.sortTerm.split(' ').pop()
    //   } catch (e) {
    //     return 'asc'
    //   }
    // },
    isLoading () {
      return this.loading.campaign[this.id]
    },
    isWorking () {
      return this.working.campaign[this.id]
    },
    tableData () {
      try {
        // map numerical ID to table data, for sorting
        return this.dialingRecords[this.id].map(v => {
          return {
            ...v,
            id: parseInt(v.refURL.split('/').pop())
          }
        })
      } catch (e) {
        return []
      }
    },
    // paginationData () {
    //   return this.dialingRecordsPageInfo[this.id] || {}
    // },
    errorData () {
      try {
        return this.dialingRecordsErrors[this.id]
      } catch (e) {
        return []
      }
    },
    id () {
      try {
        return this.campaign.refURL.split('/').pop()
      } catch (e) {
        return null
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
  }
}
</script>
