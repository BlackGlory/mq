import { go } from '@blackglory/go'
import { AbortController } from 'extra-abort'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import * as DataInSqlite3 from '@dao/data-in-sqlite3/database'
import { callNextTickEverySecond } from './schedule'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

const maintainController = new AbortController()

process.on('exit', () => {
  maintainController.abort()

  DataInSqlite3.closeDatabase()
  ConfigInSqlite3.closeDatabase()
})

process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

go(async () => {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) process.exit()

  callNextTickEverySecond(maintainController.signal)

  process.send?.('ready')
})
