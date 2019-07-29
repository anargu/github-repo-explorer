import os

from flask import Flask, request, render_template
from flask import session as login_session
from pygments import highlight

from pygments.lexers import PythonLexer
from pygments.lexers import get_lexer_by_name, get_lexer_for_filename

from pygments.formatters import HtmlFormatter

from styles.base16_kimbie_dark import base16_kimbie_dark

from flask_cors import CORS
import requests


def preprocess_theme(theme_name):
    if theme_name == 'base16_kimbie_dark':
        return base16_kimbie_dark
    else:
        return theme_name

app = Flask(__name__,
            static_folder="./dist/",
            template_folder="./dist/")


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def dender_vue(path):
    return render_template("index.html")


@app.route("/pygment", methods=["GET", "POST"])
def pygment_code():
    filename = request.args.get("filename", "hello.py")
    theme = preprocess_theme(request.args.get("theme", "emacs"))
    # props
    linenos = request.args.get("linenos", "false") == "true"

    code = """with open("out.html", "w") as f:
    highlight(code, lex, formatter, outfile=f)
    """
    style_formatter = HtmlFormatter(style=theme, linenos=linenos)
    if request.method == "POST":
        data = request.get_json()
        code = data['code']
    else:
        style_formatter = HtmlFormatter(style=theme,
                                        full=True,
                                        linenos=linenos)

    # get_lexer_by_name("python", stripall=True)
    lexer = get_lexer_for_filename(filename)
    html_snippet = highlight(code, lexer, style_formatter)
    if request.method == 'POST':
        style_snippet = style_formatter.get_style_defs()
        snippet = {'snippet': html_snippet, 'style': style_snippet}
        return snippet
    else:
        return html_snippet


token_url = 'https://github.com/login/oauth/access_token'
client_id = '8212db89c5d7a74135c1'
client_secret = 'a95f86de2fe014553b9ee79521317f6d843a041c'


@app.route("/oauth-callback", methods=["POST", "GET"])
def oauth_callback():
    # process request
    if 'code' in request.args:
        # return jsonify(code=request.args.get('code'))
        payload = {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': request.args['code']
        }
        headers = {'Accept': 'application/json'}
        req = requests.post(token_url, params=payload, headers=headers)
        resp = req.json()

        if 'access_token' in resp:
            login_session['access_token'] = resp['access_token']
            print('resp[\'access_token\']', resp['access_token'])
            return redirect('/')
        else:
            return jsonify(error="Error retrieving access_token"), 404
    else:
        return jsonify(error="404_no_code"), 404
    # generate token
    return '.'


@app.route('/ls', methods=['POST'])
def ls():
    payload = request.get_json()

    githubApiRequestUrl = ('https://api.github.com' +
                           '/repos/{}/{}/contents{}?ref={}')
    if 'access_token' in login_session:
        print(' *** login_session[\'access_token\']',
              login_session['access_token'])
        githubApiRequestUrl = ('https://api.github.com' +
                               '/repos/{}/{}/contents{}?' +
                               'ref={}&access_token={}')
        githubApiRequestUrl = githubApiRequestUrl.format(
            payload['owner'],
            payload['repo'],
            '' if payload['path'] == '' else '/' + payload['path'],
            payload['ref'],
            login_session['access_token'])
    else:
        githubApiRequestUrl = githubApiRequestUrl.format(
            payload['owner'],
            payload['repo'],
            '' if payload['path'] == '' else '/' + payload['path'],
            payload['ref'])
    print(" *** github api url: ", githubApiRequestUrl)
    return requests.get(githubApiRequestUrl).content


if __name__ == '__main__':
    is_prod = os.environ.get("PROD", False) == "true"
    if not is_prod:
        print(" * CORS enabled")
        cors = CORS(app, resources={r"*": {"origins": "*"}})
    else:
        print(" * CORS disabled for production environment")
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=(not is_prod), host='0.0.0.0', port=port)
