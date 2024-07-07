from flask import Flask
from .events import socketio
from .extensions import cache
from .router import app
from flask_cors import CORS

def create_app():
    # Config here
    app.config.from_mapping({
        "DEBUG": False, 
        "CACHE_TYPE": "SimpleCache",  # Flask-Caching related config
        "CACHE_DEFAULT_TIMEOUT": 1  # Flask-Caching related config
    })

    CORS(app, resources={r"/*": {"origins": "*"}})

    socketio.init_app(
        app,
        cors_allowed_origins="*",
        max_http_buffer_size=10_000 # 10 KB
    )

    cache.init_app(app)

    return app