
import { LitElement } from '@polymer/lit-element'
import { html } from 'lit-html'
import css from './toolbar.styl'
import eyeSVG from '../../assets/eye.svg'
import heartSVG from '../../assets/heart.svg'
import searchSVG from '../../assets/heart.svg'
import folderSVG from '../../assets/folder.svg'
import svg from '../../utils/inlinesvg'
import { saveKey } from '../../utils/localstorage'


class Toolbar extends LitElement {

	constructor() {
		super()

		this.title = '<no name>'

		// this.user = ''
		// this.repo = ''
		// this.branch = ''
	}

    static get properties () {
        return {
			title: String,
			// user: String,
			// repo: String,
			// branch: String,
		}
	}

	openFileExplorer() {
		this.dispatchEvent(
			new CustomEvent('onOpenFileExplorerClick', {})
		)
	}

	sendRepoInfo() {
		const user = this.shadowRoot.getElementById('user').value
		const repo = this.shadowRoot.getElementById('repo').value
		const branch = this.shadowRoot.getElementById('branch').value
		const personalApiToken = this.shadowRoot.getElementById('personalApiToken').value
		console.log('sendRepoInfo',
		{
			user,
			repo,
			branch,
		})
		saveKey('personalApiToken', personalApiToken)
		this.dispatchEvent(
			new CustomEvent('onLoadRepoInfo', {
				detail: {
					user: user,
					repo: repo,
					branch: branch
				}
			})
		)
	}

    render() {
        return html`
		<style>
		${css}
		</style>
		<div class="toolbar-content">
			<span
				@click=${() => { this.openFileExplorer() }}
				class="arrowright">
				${svg(folderSVG)}
			</span>
			<a href="#">${this.title}</a>
		</div>
		<div class="input-repo">
			<input id="user" type="text" placeholder="user"/>
			<input id="repo" type="text" placeholder="repository"/>
			<input id="branch" type="text" placeholder="branch"/>
			<input id="personalApiToken" type="text" placeholder="personalApiToken"/>
			<button class="btn-explore" @click=${(e) => { this.sendRepoInfo() }}>explore</button>
		</div>
		`
	}
}

customElements.define('m-toolbar', Toolbar)