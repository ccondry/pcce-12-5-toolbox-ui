<template>
  <div style="position: relative;">
    <ul>
      <!-- the all files zip -->
      <li>
        <a href="https://mm-static.cxdemo.net/outbound/all.zip">
          All Example Files
        </a>
      </li>
      <!-- each text file -->
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
    async files () {
      const type = this.type
      return [{
        name: `CumulusOutbound${type}5.txt`,
        url: await this.getFileData(`CumulusOutbound${type}5.txt`),
        text: `5 Records Example File for ${type} Campaign`
      }, {
        name: `CumulusOutbound${type}10.txt`,
        url: await this.getFileData(`CumulusOutbound${type}10.txt`),
        text: `10 Records Example File for ${type} Campaign`
      }, {
        name: `CumulusOutbound${type}20.txt`,
        url: await this.getFileData(`CumulusOutbound${type}20.txt`),
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
  },

  methods: {
    // make the browser download the text files instead of rendering them
    async getFileData (name) {
      const response = await window.fetch(`https://mm-static.cxdemo.net/outbound/${name}`)
      const text = await response.text()
      return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    }
  }
}
</script>
