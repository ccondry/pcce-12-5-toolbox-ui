<template>
  <card-modal :visible="visible" @close="close" :title="title"
  transition="zoom" @ok="ok" @cancel="close"
  :ok-text="confirmationText">
  <div class="content has-text-centered">
    <slot></slot>
  </div>
</card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'

export default {
  components: {
    CardModal
  },

  mounted () {
    // this.$refs.email.focus()
  },

  props: {
    visible: Boolean,
    title: String,
    number: String,
    confirmationText: {
      type: String,
      default: 'Send'
    }
  },

  data () {
    return {
      smsNumber: ''
    }
  },

  methods: {
    ok () {
      this.$emit('submit', {to: this.smsNumber, from: this.number})
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
