from flask import Flask

from .events import socketio

def create_app():
    app = Flask(__name__)

    socketio.init_app(app, cors_allowed_origins="*")

    return app