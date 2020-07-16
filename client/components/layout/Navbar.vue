<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <div class="columns">
        <div class="column is-3">
        </div>
        <div class="column is-6">
          <p class="level-item has-text-centered">
              <a href="/">dCloud Toolbox</a>
              &nbsp;-
              PCCE 12.5v2 Instant -
              {{ datacenter }} {{ session }}
          </p>
        </div>
        <div class="column is-3">
          <div v-if="authenticated" class="level-right">
            {{ user.username }}
            &nbsp;
            <a @click="clickLogout">Logout</a>
            &nbsp;&nbsp;
          </div>
          <div v-if="!authenticated && !production" class="level-right">
            <a @click="clickLogin">Login</a>
            &nbsp;&nbsp;
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      filter: '',
      pageSelection: 'Verticals'
    }
  },

  components: {
  },

  props: {
    show: Boolean,
    menuFilter: String
  },

  computed: {
    ...mapGetters([
      'authenticated',
      'user',
      'production',
      'instance'
    ]),
    datacenter () {
      return this.instance.datacenter
    },
    session () {
      return this.instance.session
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'setJwt'
    ]),
    clickLogout () {
      this.logout()
    },
    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT`,
        inputAttrs: {
          placeholder: 'JWT'
        },
        onConfirm: (value) => {
          this.setJwt(value)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.app-navbar {
  color: #28374B;
  background-color: white;
  font-weight: bold;
  a {
    color: #7957d5;
  }
  position: fixed;
  min-width: 100%;
  line-height: 2.35em;
  z-index: 4;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .nav {
    min-height: 0em;
  }

  .container {
    // margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }

}

.hero-head {

  // .vue {
  //   margin-left: 10px;
  //   color: #36AC70;
  // }
  // .admin {
  // }
}
</style>
