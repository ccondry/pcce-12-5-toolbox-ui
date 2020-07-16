<template>
  <card-modal :visible="visible" @close="close" :title="title"
  transition="zoom" @ok="ok" @cancel="close"
  ok-text="Send">
  <div class="content has-text-centered">
    Please enter your username (CCO email address). We will email you a link
    to reset your password.
  </div>

  <form class="control" @submit.prevent="ok">
    <p class="control has-icon">
      <input class="input is-expanded" type="text" placeholder="CCO Email Address" name="email" ref="email" autofocus v-model="email">
      <span class="icon is-small">
        <i class="fa fa-envelope"></i>
      </span>
    </p>

  </form>

</card-modal>
</template>

<script>
import { CardModal } from 'vue-bulma-modal'

export default {
  components: {
    CardModal
  },

  mounted () {
    // put the cursor in the input field
    this.$refs.email.focus()
  },

  props: {
    visible: Boolean,
    title: String
  },

  data () {
    return {
      email: ''
    }
  },

  methods: {
    ok () {
      this.$emit('submit', this.email)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
