<template>
  <div>
    <!-- Template Selector -->
    <b-modal ref="finesse-template-modal" :active.sync="showTemplateModal" :can-cancel="true" has-modal-card width="960">
      <templates
      @submit="loadTemplate"
      type="finesse"
      :compact="true"
      @save="doSaveTemplate"
      @save-as="saveAsNewTemplate" />
    </b-modal>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child box">
          <h1 class="title">Finesse Team Layout</h1>
          <!-- Loading Indicator -->
          <b-loading :active="loading.finesse.teamLayout || loading.cce.agentTeam || loading.templates.finesse || working.templates.finesse"></b-loading>
          <!-- Save Buttons -->
          <b-field label="Actions">
            <p class="control">
              <button class="button is-success" @click="clickSave" :disabled="!form.layoutXml.length">Save My Team Layout</button>
              <button class="button is-info" @click="clickSaveTemplate" :disabled="!form.layoutXml.length">Save to Template</button>
              <button class="button is-primary" @click="clickSelectTemplate">Load from Template</button>
            </p>
          </b-field>
          <!-- Use Default -->
          <b-field label="Use Default Layout">
            <div class="field">
              <b-checkbox v-model="form.useDefault">Use Default Layout</b-checkbox>
            </div>
          </b-field>
          <!-- Layout Editor -->
          <b-field label="Team Layout XML">
            <b-input
            type="textarea"
            rows="28"
            v-model="form.layoutXml"
            :disabled="form.useDefault" />
          </b-field>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Templates from '../../components/templates'
import {xml2js, js2xml} from '../../parsers'

export default {
  components: {
    Templates
  },

  data () {
    return {
      showTemplateModal: false,
      layoutJson: {},
      // gadgets: [],
      form: {
        selectedTeam: undefined,
        layoutXml: '',
        useDefault: false
      }
    }
  },

  mounted () {
    // move modal to the document body
    document.body.appendChild(this.$refs['finesse-template-modal'].$el)
    // refresh data
    this.refresh()
  },

  computed: {
    ...mapGetters([
      'user',
      'loading',
      'working',
      'useDefault',
      'layoutXml',
      'myTeams',
      'gadgets'
    ]),
    teams () {
      // regular users should see only their teams
      return this.myTeams
    },
    selectedTeam () {
      return this.form.selectedTeam
    }
  },

  methods: {
    ...mapActions([
      'getFinesseLayout',
      'saveTeamLayout',
      'saveTemplate',
      'updateLayoutEditor'
    ]),
    clickSaveTemplate () {
      this.$dialog.prompt({
        message: `What do you want to name your template?`,
        inputAttrs: {
          placeholder: 'My Template 1',
          confirmText: 'Save'
        },
        onConfirm: (name) => {
          this.doSaveTemplate(name)
        }
      })
    },
    clickSelectTemplate () {
      this.showTemplateModal = true
    },
    updateLayoutXml () {
      this.form.layoutXml = js2xml(this.layoutJson).replace(/&amp;/g, '&')
    },
    // addGadget (gadget) {
    //   this.gadgets.push(gadget)
    // },
    loadTemplate (params) {
      console.log('loadTemplate', params.name)
      this.$toast.open({
        duration: 5000,
        message: `Loaded template ${params.name} into the Finesse Layout XML editor.`,
        type: 'is-primary'
      })
      // hide modal
      this.showTemplateModal = false
      // load template data into editor
      // this.form.layoutXml = params.data.layoutXml
      // this.form.useDefault = params.data.useDefault

      // load template data into state
      this.updateLayoutEditor({
        TeamLayoutConfig: {
          layoutxml: params.data.layoutXml,
          useDefault: params.data.useDefault
        }
      })
    },
    async clickLoad () {
      console.log('this.form.selectedTeam', this.form.selectedTeam)
      try {
        // load selected team data. populates useDefault and layoutXml getter data
        await this.getFinesseLayout()
        // update cache with data we just loaded
        this.updateCache()
      } catch (e) {
        console.error('failed to load and cache team layout', e)
      }
    },
    clickSave () {
      this.saveTeamLayout({
        useDefault: this.form.useDefault,
        layoutXml: this.form.layoutXml
      })
    },
    doSaveTemplate (name) {
      // received $emit('save') from templates component
      console.log('doSaveTemplate', name)
      // hide modal
      this.saveTemplate({
        type: 'finesse',
        name: name,
        data: {
          useDefault: this.form.useDefault,
          layoutXml: this.form.layoutXml
        }
      })
    },
    saveAsNewTemplate (name) {
      console.log('save as new template', name)
      //
      this.saveTemplate({
        type: 'finesse',
        name,
        data: {
          useDefault: this.form.useDefault,
          layoutXml: this.form.layoutXml
        }
      })
    },
    refresh () {
      // load finesse layout for this user's team
      this.getFinesseLayout()
    },
    updateCache () {
      this.form.layoutXml = this.layoutXml
      this.form.useDefault = this.useDefault
      // convert to json and save in this.layoutJson
      this.layoutJson = xml2js(this.form.layoutXml.replace(/&/g, '&amp;'))
    }
  },

  watch: {
    layoutXml (val, oldVal) {
      // update form data with state data
      this.updateCache()
    }
  }
}
</script>
