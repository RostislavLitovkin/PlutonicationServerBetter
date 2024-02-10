from plutonication.limiter import limit_socketio
from .extensions import socketio
from flask_socketio import join_room, emit


@socketio.on("ping")
@limit_socketio()
def ping(message):
    """
    For debugging.
    """
    print("ping", message)
    emit("pong", message, broadcast=True)


@socketio.on("connect")
@limit_socketio()
def connect():
    """
    Event handler that is fired whenever someone connects.

    Useful for debugging.
    """
    emit("message", "Someone connected <3", broadcast=True)


@socketio.on("disconnect")
@limit_socketio()
def disconnect():
    """
    Event handler that is fired whenever someone disconnects.
    """
    emit("disconnect", "Someone disconnected :(", broadcast=True)



@socketio.on("create_room")
@limit_socketio()
def create_room(data):
    """
    Creates a new websocket room. Intended to be used by dApps.

    Docs: https://socket.io/docs/v3/rooms/
    """
    room = data["Room"]
    join_room(room)


@socketio.on("pubkey")
@limit_socketio()
def pubkey(data):
    """
    The first event emitted by wallet.

    One of the side-effects is joining a given room.
    Meaning that the wallet does not need to emit "create_room" anymore
    """
    room = data["Room"]
    join_room(room)
    emit("pubkey", str(data["Data"]), room=room)


@socketio.on("sign_payload")
@limit_socketio()
def sign_payload(data):
    """
    Event handler used by dApps. Used when requesting signature from wallet.

    You can expect the wallet to emit either "payload_signature" event or "payload_signature_rejected" event.
    """
    room = data["Room"]
    emit("sign_payload", data["Data"], room=room)


@socketio.on("sign_raw")
@limit_socketio()
def sign_raw(data):
    """
    Event handler used by dApps. Used when requesting signature from wallet.

    You can expect the wallet to emit either "raw_signature" event or "raw_signature_rejected" event.
    """
    room = data["Room"]
    emit("sign_raw", data["Data"], room=room)


@socketio.on("payload_signature")
@limit_socketio()
def payload_signature(data):
    """
    Event handler used by wallet, when wallet decides to sign given payload.
    """
    room = data["Room"]
    emit("payload_signature", data["Data"], room=room)


@socketio.on("payload_signature_rejected")
@limit_socketio()
def payload_signature_rejected(data):
    """
    Event handler used by wallet, when wallet decides to reject the signing of given payload.
    """
    room = data["Room"]
    emit("payload_signature_rejected", data["Data"], room=room)


@socketio.on("raw_signature")
@limit_socketio()
def raw_signature(data):
    """
    Event handler used by wallet, when wallet decides to sign given raw message.
    """
    room = data["Room"]
    emit("raw_signature", data["Data"], room=room)


@socketio.on("raw_signature_rejected")
@limit_socketio()
def raw_signature_rejected(data):
    """
    Event handler used by wallet, when wallet decides to reject the signing of given raw message.
    """
    room = data["Room"]
    emit("raw_signature_rejected", data["Data"], room=room)
