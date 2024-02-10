from flask import Flask
from flask_socketio import SocketIO
from flask_caching import Cache

socketio = SocketIO()

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

app = Flask(__name__)
