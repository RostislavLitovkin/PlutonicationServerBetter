import { test, expect } from '@playwright/test'
import io from 'socket.io-client'

// Tests the `limit_socketio` capabilities.
test.describe("stress tests", () => {
  test('limit_socketio', async () => {

    // You might want to change this to wss://plutonication.com/
    // or other URL, if you want to use your own endpoint.
    const socket = io("ws://127.0.0.1:8000");

    // Register on pong event handler.
    socket.on("pong", (message) => { console.log("pong: " + message) })

    // Wait for the client to connect.
    await new Promise((resolve) => {

      // Timeout to fail if client is already banned,
      // or if client cannot establish the connection with server.
      const timeout = setTimeout(() => {
        console.log("Failed to connect to the server.")
        console.log("1) maybe you forgot to run the server locally.")
        console.log("2) maybe you have already ran this test and you have been banned, " +
          "thus you can not connect again. Restart the server to get unbanned.")

        expect(false).toBeTruthy()
      }, 1000)

      socket.on("connect", () => {
        console.log("Connected")

        clearTimeout(timeout)

        resolve()
      })
    })

    // Overwhelm the limiter by calling it multiple times in quick succession.
    for (let i = 0; i < 50; i++) {
      socket.emit("ping", i)
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // The client should be disconnected and banned.
    expect(socket.connected).toBeFalsy()
  })
})
