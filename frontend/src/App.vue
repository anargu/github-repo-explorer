<template>
  <div id="app">
    <TreeView/>
  </div>
</template>

<script>
import TreeView from './components/TreeView.vue'

export default {
  name: 'app',
  components: {
    TreeView
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
