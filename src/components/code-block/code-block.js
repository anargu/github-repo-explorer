import Prism from 'prismjs';
// import loadLanguajes from 'prismjs/components';
import { LitElement } from "@polymer/lit-element";
import { html /*, render*/ } from 'lit-html'
import prismDraculaCss from './prism-dracula.css'
import axios from 'axios'
import { until } from 'lit-html/directives/until'
import style from './code-blocks.styl'


import { 
    availablePrismLanguajes } from './supportedLanguajes'

import supportedPrismLanguajes from './supportedLanguajes.json'
import supportedLanguajeClasses from './supportedClasses.json'

class CodeBlock extends LitElement {

    constructor() {
        super()
        this.codeParams = null
    }

    static get properties() {
        return {
            codeParams: Object,
        }
    }
    
    highlightCode(rawCode, ext) {
        const codeEl = document.createElement('code')
        const languajeCode = supportedPrismLanguajes[ext]
        // console.log('ext',ext, 'languajeCode', languajeCode)
        // console.log('supportedLanguajeClasses[ext]', supportedLanguajeClasses[ext])
        if(languajeCode !== undefined && (availablePrismLanguajes.indexOf(languajeCode) !== -1)) {
            const htmlPlain = Prism.highlight(rawCode, Prism.languages[languajeCode], languajeCode);
            codeEl.innerHTML = htmlPlain
        } else {
            codeEl.innerHTML = rawCode
        }

        const langClass = supportedLanguajeClasses[ext]
        if (langClass !== undefined && availablePrismLanguajes.indexOf(languajeCode) !== -1) {
            codeEl.classList.add(langClass)
        }
        return codeEl
    }

    async fetchCode() {
        if(this.codeParams === null) {
            return `Search for a repo...`
        }

        const ext = this.codeParams.treelink.name.split('.').slice(-1)[0]
        const treepath = this.codeParams.treelink.path
        const branch = this.codeParams.branch
        const repo = this.codeParams.repo
        const user = this.codeParams.user

        let response = await axios.get(
            `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${treepath}`,
            {
                transformResponse: (res) => {
                    // Do your own parsing here if needed ie JSON.parse(res);
                    return res;
                }
            })
        let rawCode = response.data
        return this.highlightCode(rawCode, ext)
    }

    render() {
        return html`
        <style>${style}</style>
        <style>${prismDraculaCss}</style>
        <pre class="">${until(this.fetchCode(), html`Search for a repo...`)}</pre>
        `
    }
}

customElements.define('code-block', CodeBlock);
