<template>
  <section>
    <b-table
    :data="campaigns"
    ref="campaignsTable"
    :narrowed="true"
    :loading="isLoading"
    detailed
    detail-key="name"
    :show-detail-icon="true"
    @details-open="openDetails"
    >
      <b-table-column
      field="refURL"
      label="ID"
      sortable
      v-slot="props"
      >
        <a @click="$refs.campaignsTable.toggleDetails(props.row)">
          {{ props.row.refURL.split('/').pop() }}
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
  </section>
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
      const id = row.refURL.split('/').pop()
      if (!this.dialingRecords[id]) {
        this.listDialingRecords(id)
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
