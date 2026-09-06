from flask import Flask, render_template, request, redirect, url_for, session, make_response
import base64
import secrets
import os

app = Flask(__name__)

# IMPORTANT:
# Set this through the environment in production.
app.secret_key = os.environ.get(
    "FLASK_SECRET_KEY",
    "KiST-CS-CTF-development-secret-change-me"
)

# Challenge configuration
CHALLENGE_NAME = "Cookie Monster's Secret Recipe"


def create_session_data():
    """
    Create completely independent challenge data for a browser session.
    """

    # Random value so every session gets a different flag.
    session_id = secrets.token_hex(4)

    # Example:
    # KiTS_CS_CTF{c00k1e_m0nster_7a91b2c4}
    flag = f"KiTS_CS_CTF{{c00k1e_m0nster_{session_id}}}"

    return session_id, flag


@app.before_request
def initialize_session():
    """
    Automatically initialize a challenge session for each browser.

    Flask stores this session in a signed cookie.
    """

    if "initialized" not in session:

        session_id, flag = create_session_data()

        session["initialized"] = True
        session["session_id"] = session_id
        session["flag"] = flag

        # Don't expose the flag through the normal Flask session.
        session.permanent = False


@app.route("/", methods=["GET"])
def index():
    return render_template(
        "index.html",
        challenge_name=CHALLENGE_NAME
    )


@app.route("/login", methods=["POST"])
def login():
    """
    Deliberately fake login.

    The challenge teaches students that the application
    relies on a cookie rather than the supplied password.
    """

    username = request.form.get("username", "")
    password = request.form.get("password", "")

    # We intentionally don't authenticate using these values.
    # Instead, the recipe cookie is the interesting part.
    return redirect(url_for("denied"))


@app.route("/denied")
def denied():
    """
    Access denied page.
    """

    response = make_response(
        render_template("denied.html")
    )

    # Get the flag belonging ONLY to this browser session.
    flag = session["flag"]

    # Base64 encode the flag.
    encoded_flag = base64.b64encode(
        flag.encode("utf-8")
    ).decode("ascii")

    # This is intentionally NOT HttpOnly.
    #
    # Students are expected to find this cookie using
    # Browser Developer Tools.
    #
    # Cookie:
    #   cookie_recipe=<base64>
    #
    response.set_cookie(
        "cookie_recipe",
        encoded_flag,
        httponly=False,
        secure=False,
        samesite="Lax"
    )

    return response


@app.route("/health")
def health():
    return {
        "status": "healthy"
    }, 200


if __name__ == "__main__":
    # 0.0.0.0 is required for Docker.
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )