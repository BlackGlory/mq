import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import * as DataInSqlite3 from '@dao/data-in-sqlite3/database'
import { resetCache } from '@env/cache'

export async function resetDatabases() {
  await resetConfigInSqlite3Database()
  await resetDataInSqlite3Database()
}

export async function resetConfigInSqlite3Database() {
  ConfigInSqlite3.closeDatabase()
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()
}

export async function resetDataInSqlite3Database() {
  await DataInSqlite3.closeDatabase()
  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()
}

export async function resetEnvironment() {
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
  delete process.env.MQ_THROTTLE

  // reset memoize
  resetCache()
}
