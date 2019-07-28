<template>
  <div id="tree-view">
    <div class="header">
      <div class="icon">
        <github-icon></github-icon>
      </div>
      <span class="name">Repo Nameasd</span>
      <div class="divider"></div>
    </div>
    <div class="content">
      <div ref="contentTree">
        <div class="item-row"
          @click="goUpperLevel">../</div>
        <div
          :key="'item-' + i"
          v-for="(itemRow, i) in treeContent"
          class="item-row"
          @click="goDeeper(itemRow.path, itemRow.type)">
          {{ itemRow.name }}{{ itemRow.suffix }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GithubIcon } from 'vue-feather-icons'

export default {
  components: {
    GithubIcon
  },
  data() {
    return {
      ref: 'master',
      owner: 'codemirror',
      repo: 'CodeMirror',
      currentPath: { path: '', type: '' },
      treeContent: []
    }
  },
  methods: {
    ls: function (path, opts = {}) {
      return new Promise((resolve) => {
        fetch(path)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
          // console.log('ls -> ', data.map(d => d.type === 'dir' ? `${d.name}/` : d.name))
          if (opts.html) {
            resolve(`<ul>${
            data.map(d => {
                const suffix = d.type === 'dir' ? `/` : '';
                return `<li><span class="link" @click="goDeeper('${d.path}', '${d.type}')">${d.name}${suffix}</span></li>`
            }).join('')
            }</ul>`);
          } else {
            resolve(
              data.map(d => ({
                type: d.type,
                name: d.name,
                path: d.path,
                suffix: d.type === 'dir' ? `/` : ''
              }))
            )
          }              
        })
      });
    },
    goDeeper: function (path, type) {
      if(path === '' && type === '') {
        return
      }
      this.currentPath = { path, type }
      const url = this.buildScrapUrl(this.owner, this.repo, path, this.ref);

      if (type === 'dir') {
          this.ls(url)
          .then(lsResponse => {
            this.treeContent = lsResponse
            // this.$refs.contentTree.innerHTML = dataHtml;
          })
      } else if (type === 'file') {
          // cat(url, { html: true })
      }
    },
    goUpperLevel() {
      this.currentPath.path = this.currentPath.path.split('/').slice(0, -1).join('/')
      this.goDeeper(this.currentPath.path, this.currentPath.type)
    },
    buildScrapUrl: function (owner, repo, path = '', ref = 'master') {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents${path === '' ? '': '/' + path}?ref=${ref}`;
        return url;
    }
  },
  mounted() {
    // scrapper
    var owner = 'codemirror';
    var repo = 'CodeMirror';
    var ref = 'master';
    const repoUrl = this.buildScrapUrl(owner, repo, '', ref);
    this.ls(repoUrl)
    .then(lsResponse => {
      this.treeContent = lsResponse
      // document.getElementById('tree-view').innerHTML = dataHtml;
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '../theme.styl'

#tree-view
  background primaryColor3
  position absolute
  top 0
  left 0
  bottom 0
  width 240px

.icon
  color color3
  display inline-block

.header
  padding 18px 0 8px 0

.header > .name
  color color3
  vertical-align super
  padding: 0 8px

.divider
  height 1px
  background color3
  margin 12px 8px 8px

.item-row
  text-align left
  color whiteColor
  margin 0px 16px
  cursor: pointer
</style>
