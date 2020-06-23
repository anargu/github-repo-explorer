import {
	LitElement
} from "@polymer/lit-element"
import {
	html
} from 'lit-html'
import css from './toolbar.styl'
import folderSVG from '../../assets/folder.svg'
import svg from '../../utils/inlinesvg'
import {
	saveKey, getKey
} from '../../utils/localstorage'
import '@material/mwc-dialog'



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

	savePersonalToken() {
		if(this.shadowRoot.getElementById('personalApiToken').value !== this.personalApiToken) {
			saveKey('personalApiToken', this.shadowRoot.getElementById('personalApiToken').value)
		}
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

		<mwc-dialog ?open=${true} class="md-dialog">
			<div>
				<div class="rocket-icon--container">
					<span class="rocket-icon">🚀</span>
				</div>
				<h4 class="highlighted-text">Github Repo Explorer</h4>
				<p>
				Does your eyes are tired of watching repositories code in white background at night?<br>
				Do you want another way to navigate through files and directories of an interesting repo?
				</p>

				<h4 class="highlighted-text">No more pain! ...Github Repo Explorer comes to rescue!</h4>				
				<p>
				Github is an interface that tries to address these little issues.
				It let's you surf over the files and dirs easily and watch the code in dark mode and avoid the blank screen while watching at night.
				</p>
				<div>
					<h4 class="highlighted-text">Then... How it works?</h4>
					<p>Because this small project depends on Github API, it requires an personal API Token
						you can generate <a target="_blank" href="https://help.github.com/es/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line">here</a>
						(only grant permissions to read public repositories)</p>
				</div>
				<div class="">
					<div class="personal-token-input">
						<input id="personalApiToken" type="text" placeholder="PUT YOUR API TOKEN HERE"/>
					</div>
				</div>
				<div class="support-disclaimer">
					<p>
					Did you use this tool? <br>
					Did you love it? Did you hate it? <br>
					If you find it useful you can share it <br>
					What things you would like to improve next? <br>I'd like to read your feedback to make it the best</div>						
					</p>
				<div>
					<button
						class="btn-primary"
						@click=${(e) => { this.savePersonalToken() }}>
						SAVE
					</button>
					<button
						class="btn-primary"
						@click=${(e) => { this.shadowRoot.querySelector('mwc-dialog').close() }}>
						CLOSE
					</button>
				</div>

			</div>
		</mwc-dialog>
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
						<button
							class="btn-primary"
							@click=${(ev) => {
								ev.preventDefault();
								this.shadowRoot.querySelector('mwc-dialog').show()
							}}
						>INFO</button>
						<button class="btn-primary" type="submit">EXPLORE &#9654;</button>
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