<template>
  <div>
    <b-table
    v-if="campaigns.length"
    :data="campaigns"
    ref="campaignsTable"
    :narrowed="true"
    :loading="isLoading"
    detailed
    detail-key="name"
    :show-detail-icon="true"
    @details-open="openDetails"
    >
      <template slot="empty">
        <div class="section">
          <div class="content has-text-grey has-text-centered">
            <div v-if="isLoading && !campaigns.length">
              <b-loading :is-full-page="false" :active="true" />
            </div>
            <div v-else>No outbound campaigns found.</div>
          </div>
        </div>
      </template>

      <b-table-column
      field="id"
      label="ID"
      sortable
      v-slot="props"
      >
        <a @click="$refs.campaignsTable.toggleDetails(props.row)">
          {{ props.row.id }}
        </a>
      </b-table-column>

      <b-table-column
      field="name"
      label="Name"
      sortable
      v-slot="props"
      >
        <a @click="$refs.campaignsTable.toggleDetails(props.row)">
          {{ props.row.name }}
        </a>
      </b-table-column>

      <b-table-column
      field="dialingMode"
      label="Mode"
      sortable
      v-slot="props"
      >
        {{ modes[props.row.dialingMode] }}
      </b-table-column>

      <b-table-column
      field="campaignPurposeType"
      label="Type"
      sortable
      v-slot="props"
      >
        {{ types[props.row.campaignPurposeType] }}
      </b-table-column>

      <b-table-column
      field="enabled"
      label="Enabled"
      sortable
      v-slot="props"
      >
        {{ props.row.enabled }}
      </b-table-column>

      <template slot="detail" slot-scope="props">
        <article class="media">
          <div class="media-content">
            <!-- <pre>{{ props.row }}</pre> -->
            <campaign-detail :campaign="props.row" />
          </div>
        </article>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CampaignDetail from './campaign-detail'

export default {
  components: {
    CampaignDetail
  },

  data () {
    return {
      types: {
        agentCampaign: 'Agent',
        ivrCampaign: 'IVR'
      },
      modes: {
        PREDICTIVEONLY: 'Predictive',
        PREVIEWONLY: 'Preview'
      }
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    ...mapActions([
      'getCampaigns',
      'listDialingRecords'
    ]),
    refresh () {
      this.getCampaigns()
    },
    openDetails (row) {
      // get dialing records for campaign that was expanded, if they haven't
      // been retrieved yet
      if (!this.dialingRecords[row.id]) {
        this.listDialingRecords(row.id)
      }
    }
  },

  computed: {
    ...mapGetters([
      'campaigns',
      'loading',
      'dialingRecords'
    ]),
    isLoading () {
      return this.loading.campaign.list
    }
  }
}
</script>
