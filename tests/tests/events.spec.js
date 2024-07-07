import { test, expect } from '@playwright/test'
import io from 'socket.io-client'

let dAppSocket
let walletSocket

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

  expect(walletSocket.connected).toBeTruthy()
  expect(dAppSocket.connected).toBeTruthy()
});

test.describe("events", () => {
  test("connect_dapp and connect_wallet", async () => {
    const pubkey = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

    dAppSocket.emit("connect_dapp", { Room: room })

    // dAppClient waits for the pubkey
    await new Promise((resolve) => {
      dAppSocket.on("pubkey", async (receivedPubkey) => {
        expect(receivedPubkey).toBe(pubkey)

        // wallet waits for the confirmation
        await new Promise((resolve) => {
          walletSocket.on("confirm_dapp_connection", () => {
            console.log("dApp confirmed connection")

            resolve()
          })
    
          dAppSocket.emit("confirm_dapp_connection", { Room: room })
        })

        resolve()
      })

      walletSocket.emit("connect_wallet", { Data: pubkey, Room: room })
    })
  })

  test("sign_payload", async () => {
    const payload = {
      address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
      blockHash: "0xd12ff783a76a5e07156d2a3ff61745b3a1f892bf6247c1b3bf0fd7ba2085eda6",
      blockNumber: "0x02c539c4",
      era: "0x481c",
      genesisHash: "0x05d5279c52c484cc80396535a316add7d47b1c5b9e0398dd1f584149341460c5",
      method: "0x050700004769bbe59968882c1597ec1151621f0193547285125f1c1337371c013ff61f0f0080c6a47e8d03",
      nonce: "0x00000001",
      signedExtensions: ['CheckNonZeroSender', 'CheckSpecVersion', 'CheckTxVersion', 'CheckGenesis', 'CheckMortality', 'CheckNonce', 'CheckWeight', 'ChargeTransactionPayment'],
      specVersion: "0x00000043",
      tip: "0x00000000000000000000000000000000",
      transactionVersion: "0x00000011",
      version: 4,
    }

    await new Promise((resolve) => {
      walletSocket.on("sign_payload", (receivedPayload) => {
        expect(receivedPayload).toEqual(payload)

        resolve()
      })

      dAppSocket.emit("sign_payload", { Data: payload, Room: room })
    })
  })

  test("payload_signature", async () => {
    const payloadSignature = {
      id: 0,
      signature: "0x018c7689022e895fe057efa09b66403cb7385585b33b7035ffd0432b9d4f97d83c16af2f197f67fc6ca7c08a2e68dd4c37e8be50a8d40f10ee04f7cc37d905b884"
    }

    await new Promise((resolve) => {
      dAppSocket.on("payload_signature", (receivedPayloadSignature) => {
        expect(receivedPayloadSignature).toEqual(payloadSignature)

        resolve()
      })

      walletSocket.emit("payload_signature", { Data: payloadSignature, Room: room })
    })
  })

  test("payload_signature_rejected", async () => {
    const rejectionReason = {
      message: "Rejection reason"
    }

    await new Promise((resolve) => {
      dAppSocket.on("payload_signature_rejected", (receivedRejectionReason) => {
        expect(receivedRejectionReason).toEqual(rejectionReason)
        resolve()
      })

      walletSocket.emit("payload_signature_rejected", { Data: rejectionReason, Room: room })
    })
  })

  test("sign_raw", async () => {
    const rawMessage = {
      address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
      data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
      type: "bytes",
    }

    await new Promise((resolve) => {
      walletSocket.on("sign_raw", (receivedRawMessage) => {
        expect(receivedRawMessage).toEqual(rawMessage)

        resolve()
      })

      dAppSocket.emit("sign_raw", { Data: rawMessage, Room: room })
    })
  })

  test("raw_signature", async () => {
    const rawSignature = {
      id: 0,
      signature: "0xaa378d6ddfae969ab35da1e412ce58f73935dcf4f5cb36bab4a8cb0a90960b02ea552de7af2ab2167241b7f74bb9813b9ebf629ff607d91cc8cd2619aa7f5286"
    }

    await new Promise((resolve) => {
      dAppSocket.on("raw_signature", (receivedRawSignature) => {
        expect(receivedRawSignature).toEqual(rawSignature)

        resolve()
      })

      walletSocket.emit("raw_signature", { Data: rawSignature, Room: room })
    })
  })

  test("raw_signature_rejected", async () => {
    const rejectionReason = {
      message: "Rejection reason"
    }

    await new Promise((resolve) => {
      dAppSocket.on("raw_signature_rejected", (receivedRejectionReason) => {
        expect(receivedRejectionReason).toEqual(rejectionReason)
        resolve()
      })

      walletSocket.emit("raw_signature_rejected", { Data: rejectionReason, Room: room })
    })
  })
});