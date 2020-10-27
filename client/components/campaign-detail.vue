<template>
  <b-tabs v-model="activeTab">
    <!-- Current Records Tab -->
    <b-tab-item label="Current Records">
      <current-records :campaign="campaign" />
    </b-tab-item>

    <!-- Create Record Tab -->
    <b-tab-item label="Create Record">
      <create-record :campaign="campaign" />
    </b-tab-item>

    <!-- Upload Records Tab -->
    <b-tab-item label="Upload Records">
      <upload-records :campaign="campaign" />
    </b-tab-item>

    <!-- Sample Records -->
    <b-tab-item label="Sample Record CSV Files">
      <sample-records :campaign="campaign" />
    </b-tab-item>
    <!-- /Upload Records Tab -->
  </b-tabs>
</template>

<script>
import UploadRecords from './upload-records'
import SampleRecords from './sample-records'
import CreateRecord from './create-record'
import CurrentRecords from './current-records'

export default {
  components: {
    UploadRecords,
    SampleRecords,
    CreateRecord,
    CurrentRecords
  },

  props: {
    campaign: {
      required: true
    }
  },

  data () {
    return {
      activeTab: 0
    }
  }
}
</script>
