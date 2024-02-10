from flask import render_template
from .extensions import app


@app.route("/")
def main_page():
    return render_template("main_page.html")


@app.route("/docs")
def docs_page():
    return render_template("docs_page.html")


@app.route("/digital_ocean_deploy_guide")
def digital_ocean_deploy_page():
    return render_template("digital_ocean_deployment_page.html")


@app.route("/deploy")
def deploy_page():
    return render_template("digital_ocean_deployment_page.html")
