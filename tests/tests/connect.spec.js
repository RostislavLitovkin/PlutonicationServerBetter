import { test, expect } from '@playwright/test'
import io from 'socket.io-client'

let dAppSocket
let walletSocket


// You might want to change this to wss://plutonication.com/
// or other URL, if you want to use your own endpoint.
const endpointUrl = "ws://127.0.0.1:8000"

const room = 12345

test.describe("connect", () => {
    test("connect wallet first", async () => {
        
        walletSocket = io(endpointUrl);

        walletSocket.on("dapp_connected", async () => {
            await walletSocket.emit("connect_wallet", { Data: pubkey, Room: room })
        })

        // Wait for the wallet socket client to connect.
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

            walletSocket.on("connect", () => {
                console.log("Wallet connected")

                clearTimeout(timeout)

                resolve()
            })
        })

        expect(walletSocket.connected).toBeTruthy()

        const pubkey = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

        await walletSocket.emit("connect_wallet", { Data: pubkey, Room: room })

        dAppSocket = io(endpointUrl)

        // Wait for the dApp socket client to connect.
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

            dAppSocket.on("connect", () => {
                console.log("dApp connected")

                clearTimeout(timeout)

                resolve()
            })
        })

        expect(dAppSocket.connected).toBeTruthy()

        await new Promise((resolve) => {
            const timeout = setTimeout(() => {
                assert(false)
            }, 5000)

            dAppSocket.on("pubkey", (receivedPubkey) => {
                expect(receivedPubkey).toBe(pubkey)

                clearTimeout(timeout)

                resolve()
            })

            dAppSocket.emit("connect_dapp", { Room: room })
        })
    })
});
