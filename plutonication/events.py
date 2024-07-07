from plutonication.limiter import limit_socketio
from .extensions import socketio
from flask_socketio import join_room, emit, rooms
from flask import request


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
    return None


@socketio.on("disconnect")
@limit_socketio()
def disconnect():
    """
    Event handler that is fired whenever someone disconnects.
    """
    for room in rooms(request.sid):
        emit("disconnect", None, to=room)


@socketio.on("connect_dapp")
@limit_socketio()
def connect_dapp(data):
    """
    Creates a new websocket room. Intended to be used by dApps.

    Docs: https://socket.io/docs/v3/rooms/
    """
    room = data["Room"]
    join_room(room)
    emit("dapp_connected", None, to=room)


@socketio.on("create_room")
@limit_socketio()
def create_room(data):
    """
    DEPRECATED: Use connect_dapp instead

    Creates a new websocket room. Intended to be used by dApps.

    Docs: https://socket.io/docs/v3/rooms/
    """
    room = data["Room"]
    join_room(room)
    emit("dapp_connected", None, to=room)


@socketio.on("confirm_dapp_connection")
@limit_socketio()
def confirm_dapp_connection(data):
    """
    Confirms that the dApp is connected to the server and that it has received the pubkey from the wallet.
    """
    room = data["Room"]
    emit("confirm_dapp_connection", None, to=room)


@socketio.on("connect_wallet")
@limit_socketio()
def connect_wallet(data):
    """
    The first event emitted by wallet.

    Joins the given room.
    Submits the pubkey/address to all other clients connected in the same room.

    Learn more about the concept of rooms: https://socket.io/docs/v3/rooms/
    """
    room = data["Room"]
    join_room(room)
    emit("pubkey", str(data["Data"]), to=room)


@socketio.on("pubkey")
@limit_socketio()
def pubkey(data):
    """
    DEPRECATED: Use connect_wallet instead

    The first event emitted by wallet.

    One of the side-effects is joining a given room.
    Meaning that the wallet does not need to emit "create_room" anymore
    """
    room = data["Room"]
    join_room(room)
    emit("pubkey", str(data["Data"]), to=room)


@socketio.on("sign_payload")
@limit_socketio()
def sign_payload(data):
    """
    Event handler used by dApps. Used when requesting signature from wallet.

    You can expect the wallet to emit either "payload_signature" event or "payload_signature_rejected" event.
    """
    room = data["Room"]
    emit("sign_payload", data["Data"], to=room)


@socketio.on("update")
@limit_socketio()
def update(data):
    """
    Event handler used by dApps. Receive an update for the extrinsic signed by a `signer.sign`
    """
    room = data["Room"]
    emit("update", data["Data"], to=room)


@socketio.on("sign_raw")
@limit_socketio()
def sign_raw(data):
    """
    Event handler used by dApps. Used when requesting signature from wallet.

    You can expect the wallet to emit either "raw_signature" event or "raw_signature_rejected" event.
    """
    room = data["Room"]
    emit("sign_raw", data["Data"], to=room)

@socketio.on("payload_signature")
@limit_socketio()
def payload_signature(data):
    """
    Event handler used by wallet, when wallet decides to sign given payload.
    """
    room = data["Room"]
    emit("payload_signature", data["Data"], to=room)


@socketio.on("payload_signature_rejected")
@limit_socketio()
def payload_signature_rejected(data):
    """
    Event handler used by wallet, when wallet decides to reject the signing of given payload.
    """
    room = data["Room"]
    emit("payload_signature_rejected", data["Data"], to=room)


@socketio.on("raw_signature")
@limit_socketio()
def raw_signature(data):
    """
    Event handler used by wallet, when wallet decides to sign given raw message.
    """
    room = data["Room"]
    emit("raw_signature", data["Data"], to=room)


@socketio.on("raw_signature_rejected")
@limit_socketio()
def raw_signature_rejected(data):
    """
    Event handler used by wallet, when wallet decides to reject the signing of given raw message.
    """
    room = data["Room"]
    emit("raw_signature_rejected", data["Data"], to=room)
