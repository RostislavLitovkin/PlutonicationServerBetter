import { test, expect } from '@playwright/test'
import io from 'socket.io-client'

let dAppSocket
let walletSocket
let thirdSocket


// You might want to change this to wss://plutonication.com/
// or other URL, if you want to use your own endpoint.
const endpointUrl = "ws://127.0.0.1:8000"

const room = 12345

// wait 1 second between each test
// This is due to the antispam protection
test.afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
})

// Connect dAppSocket and walletSocket before all tests
test.beforeAll(async () => {
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

    walletSocket = io(endpointUrl);

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

    thirdSocket = io(endpointUrl);

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

        thirdSocket.on("connect", () => {
            console.log("Third connected")

            clearTimeout(timeout)

            resolve()
        })
    })

    expect(walletSocket.connected).toBeTruthy()
    expect(dAppSocket.connected).toBeTruthy()
    expect(thirdSocket.connected).toBeTruthy()
});

test.describe("events", () => {
    test("connect_dapp and connect_wallet", async () => {
        const pubkey = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

        dAppSocket.emit("connect_dapp", { Room: room })

        await new Promise((resolve) => {
            dAppSocket.on("pubkey", (receivedPubkey) => {
                expect(receivedPubkey).toBe(pubkey)

                resolve()
            })

            walletSocket.emit("connect_wallet", { Data: pubkey, Room: room })
        })
    })

    test("disconnect wallet", async () => {
        await new Promise((resolve) => {
            dAppSocket.on("disconnect", () => {
                console.log("disconnected successfully")

                resolve()
            })

            walletSocket.disconnect()

            console.log("wallet disconnected")
        })
    })

    test("disconnect third", async () => {
        await new Promise((resolve) => {
            dAppSocket.on("disconnect", () => {
                console.log("disconnected successfully")

                assert(false)
            })

            thirdSocket.disconnect()

            console.log("third disconnected")

            setTimeout(() => {
                resolve()
            }, 5000)
        })
    })
});