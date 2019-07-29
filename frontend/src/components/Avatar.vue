<template>
  <div>
    <div id="avatar" @click="logIn">
      <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=8212db89c5d7a74135c1">
        <user-icon></user-icon>
      </a>
    </div>
    <div class="dialog">

    </div>
  </div>
</template>

<script>
import { UserIcon } from 'vue-feather-icons'

export default {
  components: {
    UserIcon
  },
  methods: {
    logIn() {
    // <p>
    //   We're going to now talk to the GitHub API. Ready?
    //   <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=<%= client_id %>">Click here</a> to begin!</a>
    // </p>
    // <p>
    //   If that link doesn't work, remember to provide your own <a href="/apps/building-oauth-apps/authorizing-oauth-apps/">Client ID</a>!
    // </p>
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../theme.styl'

#avatar
  position absolute
  top 20px
  right 20px
  background primaryColor3
  border-radius 40px
  width 40px
  height 40px
  cursor pointer

#avatar a
  text-decoration none
  color color3

#avatar svg
  display: inline-block
  margin: 7px 0 0 0

</style>
