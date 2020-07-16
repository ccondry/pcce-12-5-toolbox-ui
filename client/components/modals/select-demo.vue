<template>
  <card-modal :visible="visible" @close="close" :title="title" transition="zoom" @ok="ok" @cancel="close" ok-text="Save">
    <!-- <div class="content has-text-centered">Change the demo and parameters you would like for {{ map.internal }}</div> -->
    <div class="block">
      <div class="control is-horizontal">
        <div class="control-label">
          <label class="label">Demo</label>
        </div>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="selectedDemo" @change="updateParams">
              <option disabled selected value="null">{{ demosList[demo.demo] ? demosList[demo.demo].name || demo.demo : demo.demo }}</option>
              <option v-for="(value, key) in demos" :value="key">{{ demosList[key] ? demosList[key].name || key : key }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Description</label>
      </div>
      <div class="control">
        <p>{{ description }}</p>
      </div>
    </div>

    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Parameters</label>
      </div>
      <div class="control">

        <tabs type="boxed">
          <tab-pane label="Form" icon="fa fa-check-square">
            <form-input v-for="i in 10" :key="i" :label="`Call Variable ${i}`" v-if="formParams.hasOwnProperty('pv' + i)">
              <input class="input"
              style="width: 90%;"
              v-model="formParams['pv' + i]"
              @change="updateCallVar('pv' + i, $event.target.value)">
              <button class="button is-danger"
              @click.prevent="updateCallVar('pv' + i)"
              >X</button>
            </form-input>

            <div v-if="formParams.eccArray">
              <form-input v-for="(param, index) of formParams.eccArray" :label="`${param.name}[${param.index}]`" :key="index">
                <input class="input"
                style="width: 90%;"
                v-model="param.value"
                @change="updateEccArray(param.name, param.index, $event.target.value)">
                <button class="button is-danger"
                @click.prevent="updateEccArray(param.name, param.index)"
                >X</button>
              </form-input>
            </div>

            <div v-if="formParams.eccVar">
              <div v-for="(param, index) of formParams.eccVar">
                <!-- special selector for call type ID -->
                <div v-if="param.name === 'user.CTID'">
                  <div class="field">
                    <b-checkbox v-model="showAllCallTypes">Show All</b-checkbox>
                  </div>
                  <b-field label="Call Type">
                    <b-select placeholder="Select a Call Type"
                    @input="updateCallType"
                    v-model="param.value">
                    <option
                    v-for="option in availableCallTypes"
                    :value="option.value"
                    :key="option.value">
                    {{ option.text }}</option>
                  </b-select>
                </b-field>

              </div>
              <!-- special selector for PQ ID -->
              <div v-if="param.name === 'user.PQID'">
                <div class="field">
                  <b-checkbox v-model="showAllPrecisionQueues">Show All</b-checkbox>
                </div>
                <b-field label="Precision Queue">
                  <b-select placeholder="Select a Precision Queue"
                  @input="updatePq"
                  v-model="param.value">
                  <option
                  v-for="option in availablePqs"
                  :value="option.value"
                  :key="option.value">
                  {{ option.text }}</option>
                </b-select>
              </b-field>
            </div>
            <!-- text input for all other params -->
            <div v-if="!['user.CTID', 'user.PQID'].includes(param.name)">
              <form-input :label="param.name" :key="index">
                <input class="input"
                style="width: 90%;"
                v-model="param.value"
                @change="updateEccVar(param, $event.target.value)">
                <button class="button is-danger"
                @click.prevent="updateEccVar(param)"
                >X</button>
              </form-input>
            </div>
          </div>
        </div>

        <!-- Add Variable -->
      </tab-pane>
      <tab-pane label="Raw JSON" icon="fa fa-code">
        <textarea class="input is-12" v-model="selectedParamsString" style="min-height: 18em;"></textarea>
      </tab-pane>
    </tabs>

  </div>
</div>

<div class="control is-horizontal">
  <div class="control-label">
    <label class="label">Add Var</label>
  </div>
  <div class="control">
    <div class="select">
      <select v-model="newVarType">
        <option value="pv">Call Variable</option>
        <option value="eccVar">ECC Variable</option>
        <option value="eccArray">ECC Array</option>
      </select>
    </div>
    <div v-show="newVarType === 'pv'">
      <div class="select">
        <select v-model="selectedNewCallVar">
          <option disabled selected value="">Choose Variable</option>
          <option v-for="v of availableCallVars" :value="v.key">{{ v.name }}</option>
        </select>
      </div>
    </div>
    <div v-show="newVarType === 'eccVar'">
      <div class="select">
        <select v-model="selectedNewEccVar">
          <option disabled selected value="">Choose Variable</option>
          <option v-for="v of availableEccVars" :value="v.name">{{ v.name }}</option>
        </select>
      </div>
    </div>
    <div v-show="newVarType === 'eccArray'">
      <div class="select">
        <select v-model="selectedNewEccArray">
          <option disabled selected value="">Choose Variable</option>
          <option v-for="v of availableEccArray" :value="v">{{ v.name }}</option>
        </select>
      </div>
    </div>

  </div>
</div>

<div class="control is-horizontal">
  <div class="control-label">
    <label class="label">Add Var Value</label>
  </div>
  <div class="control">
    <input class="input" v-model="newVarValue" placeholder="New variable value" @keyup.enter="addVar">
    <button class="button is-primary" @click.prevent="addVar">Add</button>
  </div>
</div>
</card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'
import { Tabs, TabPane } from 'vue-bulma-tabs'
import FormInput from '../form/input'
import SelectInput from '../select-input.vue'

export default {
  components: {
    Tabs,
    TabPane,
    CardModal,
    FormInput,
    SelectInput
  },

  props: {
    visible: Boolean,
    title: String,
    demo: Object,
    map: Object,
    demosList: Object,
    eccVars: Array,
    callTypes: Array,
    precisionQueues: Array,
    myDepartment: Object,
    mrd: Object,
    user: Object
  },

  data () {
    return {
      selectedDemo: null,
      selectedParams: {},
      selectedParamsString: '',
      formParams: {},
      newVarType: 'pv',
      newVarName: '',
      newVarIndex: '',
      selectedNewCallVar: '',
      selectedNewEccVar: '',
      selectedNewEccArray: '',
      newVarValue: '',
      showAllCallTypes: false,
      showAllPrecisionQueues: false
    }
  },

  mounted () {
    this.selectedDemo = this.demo.demo
    this.selectedParams = this.demo.params
    this.selectedNewCallVar = this.availableCallVars[0].key
  },

  methods: {
    addVar () {
      // this.newVarType
      console.log('add new variable - type = ', this.newVarType)
      if (this.newVarType === 'pv') {
        this.updateCallVar(this.selectedNewCallVar, this.newVarValue)
        // set select option to next available
        this.$nextTick(() => {
          this.selectedNewCallVar = this.availableCallVars[0].key
        })
      } else if (this.newVarType === 'eccVar') {
        console.log('this.selectedNewEccVar', this.selectedNewEccVar)
        this.updateEccVar({name: this.selectedNewEccVar}, this.newVarValue)
        // set select option to next available
        this.$nextTick(() => {
          this.selectedNewEccVar = this.availableEccVars[0].name
        })
      } else if (this.newVarType === 'eccArray') {
        console.log('this.selectedNewEccArray', this.selectedNewEccArray)
        this.updateEccArray(this.selectedNewEccArray.key, this.selectedNewEccArray.index, this.newVarValue)
        // set select option to next available
        this.$nextTick(() => {
          this.selectedNewEccArray = this.availableEccArray[0]
        })
      }
    },
    open (url) {
      window.open(url)
    },
    ok () {
      const dnis = this.map.internal
      const demo = this.selectedDemo
      const params = JSON.parse(this.selectedParamsString)
      console.log(`updating demo for ${dnis} to ${demo} with params =`, params)
      const body = {
        dnis,
        demo,
        params
      }
      this.$emit('submit', body)
      // this.setInboundDemo(body)
    },
    close () {
      this.$emit('close')
    },
    // dismiss () {
    //   this.$children[0].deactive()
    // },
    updateTextarea (val) {
      this.selectedParamsString = JSON.stringify(val, null, 2)
    },
    updateParams () {
      // demo ID selection changed - load that demo's params to our selectedParams
      const demo = this.demos[this.selectedDemo]
      if (demo) {
        // load selected demo params to our selected params
        this.selectedParams = demo.params
        // replace any demo param template placeholders with user-specific values
        for (const v of Object.keys(this.selectedParams)) {
          // pv1, pv2, ..., pv10, eccVar, eccArray
          let value = this.selectedParams[v]
          // determine the type of var
          switch (typeof value) {
            case 'string': {
              // pv1 - 10
              value = this.replaceUserValues(value)
              break
            }
            case 'object': {
              // eccVar and eccArray arrays
              // iterate over them
              for (const av of value) {
                av.value = this.replaceUserValues(av.value)
              }
              break
            }
          }
        }
      } else {
        // do nothing?
      }
    },
    replaceUserValues (value) {
      try {
        // replace ${email} with current user's email
        value = value.replace(/\$\{email\}/g, this.user.email)
      } catch (e) {
        console.log(e)
        return value
      }
      try {
        // replace ${pqid} with first available PQID
        value = value.replace(/\$\{pqid\}/g, this.myPrecisionQueues[0].id)
      } catch (e) {
        console.log(e)
        return value
      }
      try {
        // replace ${ctid} with first available CTID
        value = value.replace(/\$\{ctid\}/g, this.myCallTypes[0].id)
      } catch (e) {
        console.log(e)
        return value
      }
      return value
    },
    updateCallVar (key, value) {
      console.log(`updating call var ${key} to ${value}`)
      // called when form changes
      let currentParams = JSON.parse(this.selectedParamsString)
      // if (value === '') {
      // remove parameter if it is blank
      // delete currentParams[key]
      // } else {
      if (value !== undefined) {
        // we have a value to set - update the var in currentParams
        currentParams[key] = value
      } else {
        // remove the value
        delete currentParams[key]
      }

      // }
      // update the text area again
      this.updateTextarea(currentParams)
    },
    updateEccArray (name, key, value) {
      console.log(`updating eccArray with ${name}[${key}] to ${value}`)
      let currentParams = JSON.parse(this.selectedParamsString)
      // check if the eccArray and attribute even exist
      if (currentParams.eccArray) {
        let index = currentParams.eccArray.findIndex(v => v.name === name && v.index === key)
        if (index >= 0) {
          // attribute exists
          // if the value is blank
          // if (value === '') {
          //   // remove the attribute
          //   currentParams.eccArray.slice(index, 1)
          //   // check if the eccArray is now empty, and remove it if so
          //   if (currentParams.eccArray.length === 0) {
          //     delete currentParams.eccArray
          //   }
          // } else {
          //   // value not blank, and attribute exists
          //   // update attribute
          //   currentParams.eccArray[index].value = value
          // }
          if (value !== undefined) {
            // we have a value to set - update the var in currentParams
            currentParams.eccArray[index].value = value
          } else {
            // remove the value
            currentParams.eccArray.splice(index, 1)
          }
        } else {
          // eccArray exists, but index doesn't exist
          // add new object to eccArray
          currentParams.eccArray.push({
            index: key,
            name,
            value
          })
        }
      } else {
        // eccArray doesn't exist
        // value is blank, just continue - nothing to do
        // if (value === '') {
        // } else {
        // value is not blank - add eccArray with new object
        currentParams.eccArray = [{
          name,
          value,
          index: key
        }]
        // }
      }

      // update the text area with new object
      this.updateTextarea(currentParams)
    },
    updateEccVar (param, value) {
      console.log(`updating ${param.name} to ${value}`)
      let currentParams = JSON.parse(this.selectedParamsString)
      // check if the eccVar exists
      if (currentParams.eccVar) {
        // eccVar exists
        let index = currentParams.eccVar.findIndex(v => v.name === param.name)
        if (index >= 0) {
          // this var exists in eccVar array
          if (value !== undefined) {
            // we have a value to set - update the var in currentParams
            currentParams.eccVar[index] = {name: param.name, value}
          } else {
            // remove the value
            currentParams.eccVar.splice(index, 1)
          }
        } else {
          // this var not in eccVar array yet - add it
          currentParams.eccVar.push({name: param.name, value})
        }
      } else {
        // eccVar doens't exist yet - set it to array with this object
        currentParams.eccVar = [{
          name: param.name,
          value
        }]
      }
      // update the text area with new object
      this.updateTextarea(currentParams)
    },
    updateCallType (val) {
      console.log('updateCallType', val)
      // const val = e.target.value
      this.updateEccVar({name: 'user.CTID'}, val)
    },
    updatePq (val) {
      this.updateEccVar({name: 'user.PQID'}, val)
    }
  },

  computed: {
    availableCallTypes () {
      return this.filteredCallTypes.map(v => ({value: v.id, text: v.name}))
    },
    availablePqs () {
      return this.filteredPrecisionQueues.map(v => ({value: v.id, text: v.name}))
    },
    demos () {
      // return Object.assign({}, this.demosList, {this.demo})
      // return [this.demo, ...this.demosList]
      return this.demosList
    },
    description () {
      const demo = this.demos[this.selectedDemo]
      if (demo && demo.description && demo.description.length > 0) {
        return demo.description
      } else {
        return 'none'
      }
    },
    availableCallVars () {
      let vars = []
      // add call vars
      for (let i = 1; i <= 10; i++) {
        vars.push({
          name: 'Call Variable ' + i,
          key: 'pv' + i
        })
      }
      return vars.filter(v => {
        // filter out elements already used in form params
        return !this.formParams[v.key]
      })
    },
    availableEccVars () {
      // filter ECC vars to only the user variables (only these are usable from app gateway)
      return this.eccUserVars.filter(v => {
        return v.eccArray === 'false'
      }).filter(v => {
        // also filter out elements already used in form params
        return !(this.formParams.eccVar && this.formParams.eccVar.find(x => x.name === v.name))
      })
    },
    availableEccArray () {
      // filter ECC array vars to only the user variables (only these are usable from app gateway)
      let list = this.eccUserVars.filter(v => {
        return v.eccArray === 'true'
      })
      let vars = []
      // add ecc arrays
      list.forEach(entry => {
        for (let i = 0; i < entry.maximumArraySize; i++) {
          vars.push({
            name: `${entry.name}[${i}]`,
            key: entry.name,
            index: i
          })
        }
      })

      return vars.filter(v => {
        // also filter out elements already used in form params
        return !(this.formParams.eccArray && this.formParams.eccArray.find(x => x.name === v.key && x.index === v.index))
      })
    },
    eccUserVars () {
      try {
        return this.eccVars.filter(v => {
          return v.name.startsWith('user.') && v.enabled
        })
      } catch (e) {
        return []
      }
    },
    filteredCallTypes () {
      // show all?
      if (this.showAllCallTypes) {
        // return unfiltered results
        return this.callTypes
      } else {
        return this.myCallTypes
      }
    },
    myCallTypes () {
      // filter call types
      if (this.myDepartment && this.myDepartment.refURL) {
        // return only call types in user's department
        return this.callTypes.filter(v => {
          if (v.department) {
            // check that the current call type has a department before comparing refURL property
            return v.department && v.department.refURL === this.myDepartment.refURL
          } else {
            return false
          }
        })
      } else {
        // could not find user's department refURL - so return empty list
        return []
      }
    },
    mrdPqs () {
      return this.precisionQueues.filter(v => v.mediaRoutingDomain.refURL === this.mrd.refURL)
    },
    filteredPrecisionQueues () {
      // show all?
      if (this.showAllPrecisionQueues) {
        // return unfiltered call types
        return this.mrdPqs
      } else {
        return this.myPrecisionQueues
      }
    },
    myPrecisionQueues () {
      // filter results
      if (this.myDepartment.refURL) {
        // return only call types in user's department
        return this.mrdPqs.filter(v => {
          // check that the current call type has a department before comparing refURL property
          // also make sure this PQ is in the same MRD that we're editing for
          return v.department && v.department.refURL === this.myDepartment.refURL
        })
      } else {
        // could not find user's department refURL - so return empty list
        return []
      }
    }
  },

  watch: {
    selectedParams (val, oldVal) {
      this.updateTextarea(val)
    },
    selectedParamsString (val, oldVal) {
      // update the form's mutable params object, if the editor has valid JSON right now
      try {
        this.formParams = JSON.parse(val)
      } catch (e) {
        // invalid JSON - leave it alone
      }
    },
    // formParams (val, oldVal) {
    // update the text area when the form changes
    // this.updateTextarea(val)
    // },
    visible (val, oldVal) {
      // this.$children[0].active()
    },
    demo (val, oldVal) {
      this.selectedDemo = this.demo.demo
      this.selectedParams = this.demo.params
    },
    newVarType (val, oldVal) {
      console.log('newVarType', val)
      try {
        // update the call variable selection to the first available, if it is not set to anything
        if (val === 'pv' && this.selectedNewCallVar === '') {
          // this.selectedNewCallVar = 'pv1'
          this.selectedNewCallVar = this.availableCallVars[0].key
          console.log('this.selectedNewCallVar', this.selectedNewCallVar)
        } else if (val === 'eccVar' && this.selectedNewEccVar === '') {
          this.selectedNewEccVar = this.availableEccVars[0].name
        } else if (val === 'eccArray' && this.selectedNewEccArray === '') {
          this.selectedNewEccArray = this.availableEccArray[0]
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
