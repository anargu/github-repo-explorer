import { LitElement } from "@polymer/lit-element";
import {html} from 'lit-html';
import axios from 'axios'
import { until } from 'lit-html/directives/until'
import style from './file-explorer.styl'
import { getKey } from '../../utils/localstorage'
import folderSVG from '../../assets/folder.svg'
import fileTextSVG from '../../assets/file-text.svg'
import githubSVG from '../../assets/github.svg'
import svg from '../../utils/inlinesvg'



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
            this.threeLinks.unshift({path: uplevel, name: '..', type: 'dir'})
        }
        const li = this.threeLinks.map(
            (tl) => html`<li @click=${(e) => this.onTreeLinkClick(tl)}>
                <span class="item-icon">${tl.type === 'dir' ? svg(folderSVG) : svg(fileTextSVG)}</span>
                <span class="item-name"> ${tl.name} </span>
                </li>`)
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
            <span class="repo-icon">${svg(githubSVG)}</span>
            <div class="repo-name">${this.user}/${this.repo}</div>
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
                return this.renderTreeList(this.threeLinks)        
            } else {
                this.isFile = false
            }
            response.data.sort((a,b) => {
                if(a.type === 'dir' && b.type === 'file') {
                    return -1
                }
                if(a.type === 'file' && b.type === 'dir') {
                    return 1
                }
                return 0
            })
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
