from plutonication import create_app, socketio

app = create_app()

# main method
if __name__ == "__main__":
    socketio.run(host="0.0.0.0", port="8090")
