import * as Config from '@dao/config/database.js'
import * as Data from '@dao/data/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import Ajv from 'ajv'

const ajv = new Ajv.default()
let server: ReturnType<typeof buildServer>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await initializeDatabases()
  server = buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases() {
  Config.openDatabase()
  await Config.prepareDatabase()

  Data.openDatabase()
  await Data.prepareDatabase()
}

export async function clearDatabases() {
  Config.closeDatabase()
  Data.closeDatabase()
}

async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.MQ_ADMIN_PASSWORD
  delete process.env.MQ_LIST_BASED_ACCESS_CONTROL
  delete process.env.MQ_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.MQ_PRODUCE_TOKEN_REQUIRED
  delete process.env.MQ_CONSUME_TOKEN_REQUIRED
  delete process.env.MQ_CLEAR_TOKEN_REQUIRED
  delete process.env.MQ_JSON_VALIDATION
  delete process.env.MQ_JSON_PAYLOAD_ONLY
  delete process.env.MQ_DEFAULT_JSON_SCHEMA
  delete process.env.MQ_UNIQUE
  delete process.env.MQ_DRAFTING_TIMEOUT
  delete process.env.MQ_ORDERED_TIMEOUT
  delete process.env.MQ_ACTIVE_TIMEOUT

  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
