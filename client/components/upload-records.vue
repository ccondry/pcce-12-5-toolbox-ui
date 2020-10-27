<template>
  <div style="position: relative;">
    <b-loading :active="isWorking" :is-full-page="false" />
    <!-- choose file -->
    <b-field label="Choose File">
      <b-upload v-model="file" drag-drop expanded>
        <div class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p v-if="!file.name">
              Drop your file here or click to choose a file
            </p>
            <p v-else style="display: flex; justify-content: center;">
              <pre v-if="file.name" style="text-align: left;">{{ truncatedFileData }}</pre>
            </p>
          </div>
        </div>
      </b-upload>
    </b-field>

    <!-- overwrite -->
    <b-field>
      <b-checkbox v-model="overwrite">
        Delete Existing Contacts
      </b-checkbox> 
    </b-field>

    <!-- upload button -->
    <b-field>
      <b-button
      :disabled="!file.name"
      expanded
      type="is-success"
      @click="clickUpload"
      >
        Upload {{ file.name }} {{ uploaded ? 'Again' : '' }}
      </b-button>
    </b-field>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      file: {},
      fileData: '',
      overwrite: false,
      uploaded: false
    }
  },

  methods: {
    ...mapActions([
      'addDialingRecords'
    ]),
    clickUpload () {
      const reader = new window.FileReader()
      // upload the selected file
      // reader.addEventListener('onloadend', result => {
      //   console.log(result)
      // })
      reader.onloadend = async result => {
        console.log(result.target.result)
        await this.addDialingRecords({
          id: this.id,
          records: result.target.result,
          overwrite: this.overwrite
        })
        this.uploaded = true
      }
      reader.readAsText(this.file)
    }
  },

  computed: {
    ...mapGetters([
      'working',
      'loading'
    ]),
    truncatedFileData () {
      const rows = this.fileData.match(/\n/g)
      if (rows) {
        console.log('rows = ', rows)
        if (rows.length > 15) {
          const ret = this.fileData.split('\n').slice(0, 15)
          ret.push(`...and ${rows.length - 15} more records`)
          return ret.join('\n')
        } else {
          return this.fileData
        }
      }
    },
    isWorking () {
      return this.working.campaign[this.id]
    },
    isLoading () {
      return this.loading.campaign[this.id]
    },
    id () {
      try {
        return this.campaign.refURL.split('/').pop()
      } catch (e) {
        return null
      }
    }
  },

  watch: {
    file (val, oldVal) {
      // set uploaded = false for our new file
      this.uploaded = false
      // store file data locally if file.name exists
      const reader = new window.FileReader()
      reader.onloadend = async result => {
        this.fileData = result.target.result
      }
      if (val.name) {
        reader.readAsText(val)
      }
    }
  }
}
</script>
