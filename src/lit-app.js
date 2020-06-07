import { LitElement } from "@polymer/lit-element";
import { html /*, render*/ } from 'lit-html'

// import { when } from 'lit-html/directives/when'
// import { until } from 'lit-html/directives/until'
// import { guard } from 'lit-html/directives/guard'
// import { ifDefined } from 'lit-html/directives/if-defined'
// import { asyncAppend } from 'lit-html/directives/async-append'
// import { asyncReplace } from 'lit-html/directives/async-replace'

import './components/toolbar/toolbar.js'
import appCss from './lit-app.styl'
import './components/box-card/box-card.js'
import './components/code-block/code-block.js'
import './components/file-explorer/file-explorer.js'

// import { offlineWatcher } from './helpers/network'

const wait = (t) => new Promise((resolve) => setTimeout(resolve, t))
async function* countUp() {
    let i = 0;
    while (i < 10) {
        yield i++;
        await wait(1000);
    }
}


class LitApp extends LitElement {

    constructor() {
        super()
        this.codeParams = null
        this.closeFileExplorer = false
        this.repoParams = {}
    }

    static get properties() {
        return {
            codeParams: Object,
            closeFileExplorer: Boolean,
            repoParams: Object
        }
    }

    fetchCode(ev) {
        this.codeParams = ev.detail
    }

    render() {
        return html`
        <style>
        ${appCss}
        </style>

        <m-toolbar
            @onOpenFileExplorerClick=${() => { this.closeFileExplorer = false }}
            @onLoadRepoInfo=${(ev) => {
                console.log('onLoadRepoInfo', ev.detail)
                this.repoParams = {
                    user: ev.detail.user,
                    repo: ev.detail.repo,
                    branch: ev.detail.branch
                }
            }}
            title="OctoRepoViewer"></m-toolbar>

        <div class="page-container">

            <file-explorer
                .user=${this.repoParams.user}
                .repo=${this.repoParams.repo}
                .branch=${this.repoParams.branch}
                .hidden=${this.closeFileExplorer}
                @onCloseClick=${() => {this.closeFileExplorer = true}}
                @onFileSelected=${(ev) => {
                this.fetchCode(ev)
            }}></file-explorer>

            <code-block .codeParams=${this.codeParams}></code-block>
        </div>
        `
    }
}

customElements.define('lit-app', LitApp)