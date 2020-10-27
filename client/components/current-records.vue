<template>
  <div style="display: flex; flex-direction: column;">
    <div class="box">
      <b-table
      :ref="`campaign${id}DetailTable`"
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
      
      <div class="buttons" style="display: flex; justify-content: flex-end; padding-top: 1rem;">
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
    </div>
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

  computed: {
    ...mapGetters([
      'user',
      'dialingRecords',
      'loading',
      'working'
    ]),
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
    id () {
      try {
        return this.campaign.refURL.split('/').pop()
      } catch (e) {
        return null
      }
    }
  },

  methods: {
    ...mapActions([
      'listDialingRecords',
      'deleteDialingRecords'
    ]),
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
    }
  }
}
</script>
