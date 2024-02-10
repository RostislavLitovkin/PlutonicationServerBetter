from .extensions import socketio
from flask_socketio import join_room, emit

@socketio.on('connect')
def connect():
    print("Someone connected :D")
    emit('message', "Someone connected :P", broadcast=True)

@socketio.on('create_room')
def message(data):
    room = data["Room"]
    d = data["Data"]
    join_room(room)
    print("new room: " + str(room))
    print('received message: ' + d)

@socketio.on('sign_payload')
def sign_payload(data):
    room = data["Room"]
    print('sign payload: ' + str(data["Data"]))
    emit("message", data["Data"], room=room)
    emit("sign_payload", data["Data"], room=room)

@socketio.on('sign_raw')
def sign_raw(data):
    room = data["Room"]
    print('sign payload: ' + str(data["Data"]))
    emit("message", data["Data"], room=room)
    emit("sign_raw", data["Data"], room=room)

@socketio.on('signature')
def signature(data):
    room = data["Room"]
    print('signature: ' + str(data["Data"]))
    emit("message", data["Data"], room=room)
    emit("signature", data["Data"], room=room)

@socketio.on('signed_payload')
def signed_payload(data):
    room = data["Room"]
    print('signed payload: ' + str(data["Data"]))
    emit("message", data["Data"], room=room)
    emit("signed_payload", data["Data"], room=room)

@socketio.on('pubkey')
def pubkey(data):
    room = data["Room"]
    join_room(room)
    print('Passing pubkey: ' + str(data["Data"]))
    emit("receivepubkey", str(data["Data"]), room=room)
