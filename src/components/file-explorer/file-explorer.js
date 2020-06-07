import { LitElement } from "@polymer/lit-element";
import {html} from 'lit-html';
import axios from 'axios'
import { until } from 'lit-html/directives/until'
import style from './file-explorer.styl'
import { getKey } from '../../utils/localstorage'

class FileExplorer extends LitElement {

    constructor() {
        super()
        this.GithubAPIBaseUrl = 'https://api.github.com'

        this.treepath = ''
        this.isFile = false

        this.threeLinks = []
    }

    static get properties() {
        return {
            user: String,
            repo: String,
            branch: String,
            treepath: String
        }
    }

    completeUrl() {
        if(this.isFile) {
            return `https://raw.githubusercontent.com/${this.user}/${this.repo}/${this.treepath}`
        }
        return `${this.GithubAPIBaseUrl}/repos/${this.user}/${this.repo}/contents/${this.treepath || ''}`
    }

    renderTreeList() {
        if(this.treepath !== '') {
            const uplevel = this.treepath.split('/').slice(0,-1).join('/')
            this.threeLinks.unshift({path: uplevel, name: '..'})
        }
        const li = this.threeLinks.map(
            (tl) => html`<li @click=${(e) => this.onTreeLinkClick(tl)}>${tl.name}</li>`)
        return html`
        <ul>
            ${li}
        </ul>
        `
    }
    
    onTreeLinkClick(tl) {
        console.log('onTreeLinkClick triggered', tl)
        // tl.name
        if(tl.type === 'file') {
            this.dispatchEvent(
                new CustomEvent(
                    'onFileSelected',
                    { detail: { treelink: tl, branch: this.branch, user: this.user, repo: this.repo }}))
        } else {
            this.treepath = tl.path
        }
    }

    render() {
        return html`
        <style>${style}</style>
        <div class="close-icon"><span @click=${(e) => this.onCloseClick()}>&times;</span></div>
        <div class="title">
        ${this.user}/${this.repo}
        </div>
        ${until(this.fetchTree(), html`<p>loading...<p>`)}
        `
    }

    onCloseClick() {
        this.dispatchEvent(
            new CustomEvent('onCloseClick', {})
        )
    }

    async fetchTree() {
        if(this.user === undefined || this.repo === undefined || this.branch === undefined) {
            return
        }
        try {
            let response = await axios.get(this.completeUrl(), { headers: { 'Authorization': `token ${getKey('personalApiToken')}` }})
            if(!Array.isArray(response.data)) {
                // it's tree view
                this.isFile = true
                // this.dispatchEvent(
                //     new CustomEvent(
                //         'onFileSelected',
                //         { detail: { filepath: response.data.path, user: this.user, repo: this.repo, branch: this.branch }}))
                return this.renderTreeList(this.threeLinks)        
            } else {
                this.isFile = false
            }
            this.threeLinks = response.data.map((t) => ({ name: t.name, path: t.path, type: t.type}))
            return this.renderTreeList(this.threeLinks)
        } catch (error) {
            console.log(error)
            return this.renderTreeList(this.threeLinks)
        }
    }

    async firstUpdated(props) {
        // try {
        //     let result = await this.fetchTree()
        //     console.log(result)
        // } catch (error) {
        //     console.log(error)            
        // }
    }
}

customElements.define('file-explorer', FileExplorer)
