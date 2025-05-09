import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { resetCache } from '@env/cache.js'
import { startServer } from '@src/server.js'
import Ajv from 'ajv'
import { ClientProxy } from 'delight-rpc'
import { IAPI } from '@src/contract.js'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { WebSocket } from 'ws'
import { createClient } from '@delight-rpc/websocket'

const ajv = new Ajv.default()
let closeServer: ReturnType<typeof startServer>
let address: string

export async function startService(): Promise<void> {
  await initializeDatabases()
  closeServer = startServer('localhost', 8080)
  address = 'ws://localhost:8080'
}

export async function stopService(): Promise<void> {
  await closeServer()
  clearDatabase()
  resetEnvironment()
}

export async function initializeDatabases(): Promise<void> {
  openDatabase()
  await prepareDatabase()
}

export function clearDatabase(): void {
  closeDatabase()
}

function resetEnvironment(): void {
  // reset memoize
  resetCache()
}

export async function buildClient(): Promise<ClientProxy<IAPI>> {
  const ws = new WebSocket(address)
  await waitForEventEmitter(ws, 'open')
  const [client] = createClient<IAPI>(ws)
  return client
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
