from flask import Flask, request

from pygments import highlight

from pygments.lexers import PythonLexer
from pygments.lexers import get_lexer_by_name, get_lexer_for_filename

from pygments.formatters import HtmlFormatter

from styles.base16_kimbie_dark import base16_kimbie_dark


def preprocess_theme(theme_name):
    if theme_name == 'base16_kimbie_dark':
        return base16_kimbie_dark
    else:
        return theme_name

app = Flask(__name__)


@app.route("/pygment", methods=["GET", "POST"])
def pygment_code():
    filename = request.args.get("filename", "hello.py")
    theme = preprocess_theme(request.args.get("theme", "emacs"))
    # props
    linenos = request.args.get("linenos", "false") == "true"

    code = """
with open("out.html", "w") as f:
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
