<template>
  <div id="app">
    <TreeView/>
    <Avatar/>
  </div>
</template>

<script>
import TreeView from './components/TreeView.vue'
import Avatar from './components/Avatar.vue'
import { getParameterByName } from './utils.js'

export default {
  name: 'app',
  components: {
    TreeView, Avatar
  },
  mounted() {
    // console.log('this.$route.query', getParameterByName('example'))
  }
}
</script>

<style  lang="stylus">
@import './theme.styl'

html, body
  background primaryColor1

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
