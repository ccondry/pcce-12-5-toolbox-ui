<template>
  <div style="position: relative;">
    <ul>
      <li>
        <a href="https://mm-static.cxdemo.net/outbound/all.zip" download="all.zip">
          All Example Files
        </a>
      </li>
      <li v-for="file of files" :key="file.name">
        <a :href="file.url" :download="file.name">
          {{ file.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },

  computed: {
    files () {
      const type = this.type
      return [{
        name: `CumulusOutbound${type}5.txt`,
        url: `https://mm-static.cxdemo.net/outbound/CumulusOutbound${type}5.txt`,
        text: `5 Records Example File for ${type} Campaign`
      }, {
        name: `CumulusOutbound${type}10.txt`,
        url: `https://mm-static.cxdemo.net/outbound/CumulusOutbound${type}10.txt`,
        text: `10 Records Example File for ${type} Campaign`
      }, {
        name: `CumulusOutbound${type}20.txt`,
        url: `https://mm-static.cxdemo.net/outbound/CumulusOutbound${type}20.txt`,
        text: `20 Records Example File for ${type} Campaign`
      }]
    },
    type () {
      // which campaign demo type this is
      if (this.campaign.campaignPurposeType === 'ivrCampaign') {
        return 'IVR'
      } else if (this.campaign.dialingMode === 'PREVIEWONLY') {
        return 'Preview'
      } else if (this.campaign.dialingMode === 'PREDICTIVEONLY') {
        return 'Agent'
      } else {
        return 'unknown'
      }
    }
  }
}
</script>
