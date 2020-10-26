<template>
  <form @submit.prevent="clickLoadTemplate">
    <!-- Loading Indicator -->
    <b-loading :is-full-page="false" :active="loading.templates[type]" :can-cancel="false"></b-loading>

    <div class="modal-card" style="width: auto">
      <!-- Header -->
      <header class="modal-card-head">
        <p class="modal-card-title">Load a Template</p>
      </header>
      <!-- Body -->
      <section class="modal-card-body">
        <div class="block">
          <div class="field">
            <b-checkbox v-model="filterTemplates">Only show my templates</b-checkbox>
          </div>
          <b-select v-model="selectedTemplate">
            <option value="" disabled selected>Choose a template to load</option>
            <option v-for="template in systemTemplates" :value="template._id">{{ template.name }}</option>
            <option disabled selected>-----------------------</option>
            <option v-for="template in filteredSortedTemplates" :value="template._id">{{ template.name }}</option>
          </b-select>
        </div>
        <b-field grouped group-multiline>
          <p class="control" v-if="!compact">
            <button type="button" class="button is-success"
            @click="clickSaveTemplate"
            :disabled="disableSaveTemplate">Save</button>
          </p>
          <p class="control" v-if="!compact">
            <button type="button" class="button is-success"
            @click="clickSaveAsTemplate">Save As</button>
          </p>
          <p class="control" v-if="!compact">
            <button type="button" class="button is-info"
            @click="refresh">Refresh</button>
          </p>
        </b-field>
        <div class="content" v-if="!compact">
          <p>
            Use this form to load and save existing templates.
          </p>
          <p>
            You can save over your own templates again by using the save button
            on this panel. You will not be able to save over other users'
            templates.
          </p>
          <p>
            You can create new templates using the 'Save As' button.
          </p>
        </div>
      </section>
      <!-- Footer -->
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" type="submit">Load Template</button>
      </footer>
    </div>
  </form>

</template>


<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['type', 'compact'],

  data () {
    return {
      templateString: '',
      selectedTemplate: '',
      filterTemplates: true,
      formModel: {},
      showModal: false
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    ...mapActions({
      loadTemplates: 'loadTemplates',
      getTemplate: 'getTemplate',
      saveTemplate: 'saveTemplate'
    }),
    refresh () {
      console.log('templates.vue refresh() - loading templates for type', this.type)
      // load templates
      this.loadTemplates({type: this.type, showNotification: false})
    },
    updateCache (data) {
      // copy state data to local data
      this.templateString = JSON.stringify(data, null, 2)
    },
    async clickLoadTemplate () {
      console.log('loading template', this.selectedTemplate)
      // load full template data
      await this.getTemplate({
        type: this.type,
        id: this.selectedTemplate
      })
      // emit data
      this.$emit('load', this.template)
    },
    clickSaveTemplate () {
      console.log('saving template', this.template)
      this.$emit('save', this.template)
    },
    clickSaveAsTemplate () {
      console.log('saving as template')
      // show the Save As modal
      this.showModal = true
    },
    modalSubmit (name) {
      // dismiss the modal
      this.showModal = false
      // submit the Save As modal
      this.$emit('save-as', name)
    }
  },

  computed: {
    ...mapGetters([
      'template',
      'templates',
      'user',
      'loading',
      'working'
    ]),
    sortedTemplates () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.templates[this.type]))
        // case-insensitive sort
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        // console.log(`couldn't get sorted templates`, e)
        return []
      }
    },
    systemTemplates () {
      return this.sortedTemplates.filter(v => v.owner === 'system')
    },
    filteredSortedTemplates () {
      if (this.filterTemplates) {
        return this.sortedTemplates.filter(v => {
          return v.owner === this.user.username
        })
      } else {
        return this.sortedTemplates.filter(v => v.owner !== 'system')
      }
    },
    disableSaveTemplate () {
      if (this.selectedTemplate.length) {
        // any template has been selected
        if (this.template.owner === this.user.username || this.user.admin) {
          // this user owns this template or is an admin
          return false
        } else {
          // this user doesn't have access to save over this template,
          // so disable the button
          return true
        }
      } else {
        // template selection still on placeholder option
        return true
      }
    }
  },

  watch: {
    selectedTemplate (val) {
      // load template when one is selected
      // this.clickLoadTemplate()
      console.log('selected', this.type, 'template ID', val)
    }
  }
}
</script>
