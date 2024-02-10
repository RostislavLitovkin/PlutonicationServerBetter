from plutonication import create_app, socketio

app = create_app()

if __name__ == "__main__":
    app.debug = True
    socketio.run(app, host="0.0.0.0", port="8090")
