import {
	LitElement
} from '@polymer/lit-element'
import {
	html
} from 'lit-html'
import css from './toolbar.styl'
import folderSVG from '../../assets/folder.svg'
import svg from '../../utils/inlinesvg'
import {
	saveKey, getKey
} from '../../utils/localstorage'


class Toolbar extends LitElement {

	constructor() {
		super()

		this.title = '<no name>'
		// this.personalApiToken;
	}

	static get properties() {
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
		let repoLink = this.shadowRoot.getElementById('repolink').value
		repoLink = repoLink.replace('https://github.com/', '')
		repoLink = repoLink.split('/')
		let user, repo, branch
		if (repoLink.indexOf('tree') === -1) {
			user = repoLink[0]
			repo = repoLink[1]
			branch = 'master'
		} else {
			user = repoLink[0]
			repo = repoLink[1]
			branch = repoLink[3]
		}

		console.log('sendRepoInfo', {
			user,
			repo,
			branch
		})
		if(this.shadowRoot.getElementById('personalApiToken').value !== this.personalApiToken) {
			saveKey('personalApiToken', this.shadowRoot.getElementById('personalApiToken').value)
		}
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
		return html `
		<style>
		${css}
		</style>
		<div class="toolbar-content">
			<div class="toolbar-inner-content">
				<span
					@click=${() => { this.openFileExplorer() }}
					class="arrowright">
					${svg(folderSVG)}
				</span>
				<a href="#">${this.title}</a>

				<iframe id="github-star-link"
					src="https://ghbtns.com/github-btn.html?user=anargu&repo=octo-repo-viewer&type=star&count=true"
					frameborder="0"
					scrolling="0"
					width="150"
					height="20"
					title="GitHub"></iframe>

				<div class="input-repo">
					<form id="formRepoSearch">
						<input id="repolink" type="text" placeholder="REPO URL"/>
						<input id="personalApiToken" type="text" placeholder="personalApiToken"/>
						<button class="btn-explore" type="submit">EXPLORE &#9654;</button>
					</form>				
				</div>
			</div>
		</div>
		`
	}

	firstUpdated(props) {
		this.personalApiToken = getKey('personalApiToken')
		this.shadowRoot.getElementById('personalApiToken').value = this.personalApiToken
		this.shadowRoot.getElementById('formRepoSearch').addEventListener('submit', (ev) => {
			ev.preventDefault()
			this.sendRepoInfo()
			return false
		})
	}
}

customElements.define('m-toolbar', Toolbar)