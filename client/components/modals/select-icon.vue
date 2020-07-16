<template>
  <card-modal :visible="visible" @close="close" :title="title"
  transition="zoom" @ok="ok" @cancel="close"
  ok-text="Ok">
  <!-- <div class="content has-text-centered">
    Please select the icon you wish to use
  </div> -->
    <a v-for="icon of iconList" @click.prevent="$emit('submit', {icon, context})" :title="icon">
      <b-icon pack="fa" :icon="icon" size="is-large" style="margin-left: 8px;" />
    </a>
</card-modal>
</template>

<script>
import iconList from './icon-list.json'
import iconTranslations from './v4-icon-translations.json'
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
    context: Object
  },

  data () {
    return {
      iconList,
      iconTranslations
    }
  },

  methods: {
    ok () {
      // return original icon
      this.$emit('submit', {icon: this.context.mobileOption.icon, context: this.context})
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
