from functools import wraps
from typing import Callable
from flask_socketio import disconnect
from flask import request
from .extensions import cache

def limit_socketio(
    key: str = 'socketio',
    allowance: int = 30 # max 30 requests per 1 second
) -> Callable:
    """
    Rate-limiter for Socket.IO event handlers.

    :param key: The key (prefix) of the redis object for tracking request rate
    :param window: Length (in seconds) of the window
    :param allowance: How many requests to allow within the window

    Inspiration from: https://haliphax.dev/2021/03/rate-limiting-with-flask-socketio/

    Instead of using Redis, I am using flask-caching,
    which is better suited in my opinion.

    Flask-caching docs: https://flask-caching.readthedocs.io/en/latest/
    """
    def wrapper(f: Callable):
        @wraps(f)
        def func(*args, **kwargs):
            # request.remote_addr is ip adress
            cacheKey = f'{key}.{request.remote_addr}'
            u = cache.get(cacheKey)

            if u is None:
                cache.set(cacheKey, 1)
                u = 1

            # Ban the user if they exceeded the allowance limit
            elif u > allowance:
                disconnect()
                cache.set(cacheKey, u, timeout=3600) # timeout = 1 hour
                return None
            
            else:
                u += 1
                cache.set(cacheKey, u)

            return f(*args, **kwargs)

        return func

    return wrapper
