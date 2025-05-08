import * as Config from '@dao/config/database.js'
import * as Data from '@dao/data/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import Ajv from 'ajv'
import { UnpackedPromise } from 'hotypes'

const ajv = new Ajv.default()
let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

export function getAddress(): string {
  return address
}

export async function startService(): Promise<void> {
  await initializeDatabases()
  server = await buildServer()
  address = await server.listen()
}

export async function stopService(): Promise<void> {
  await server.close()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases(): Promise<void> {
  Config.openDatabase()
  await Config.prepareDatabase()

  Data.openDatabase()
  await Data.prepareDatabase()
}

export function clearDatabases(): void {
  Config.closeDatabase()
  Data.closeDatabase()
}

function resetEnvironment(): void {
  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
