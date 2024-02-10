from flask import render_template
from .extensions import app


@app.route("/")
@app.route("/docs")
def main_page():
    return render_template("main_page.html")


@app.route("/docs/flask-server")
def flask_server_docs_page():
    return render_template("flask_server_docs_page.html")


@app.route("/docs/javascript")
def plutonication_javascript_page():
    return render_template("plutonication_javascript_page.html")


@app.route("/docs/react-example")
def plutonication_react_example_page():
    return render_template("plutonication_react_example_page.html")


@app.route("/docs/csharp")
def plutonication_csharp_page():
    return render_template("plutonication_csharp_page.html")


@app.route("/digital_ocean_deploy_guide")
@app.route("/deploy")
@app.route("/deploy/flask")
@app.route("/deploy/flask-digital-ocean")
def digital_ocean_deployment_page():
    return render_template("digital_ocean_deployment_page.html")

