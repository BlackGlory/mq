import { AbortController } from 'abort-controller'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import * as DataInSqlite3 from '@dao/data-in-sqlite3/database'
import { autoMaintain } from '@core/mq'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

const autoMaintainController = new AbortController()

process.on('exit', () => {
  autoMaintainController.abort()

  DataInSqlite3.closeDatabase()
  ConfigInSqlite3.closeDatabase()
})

process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

;(async () => {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()

  autoMaintain(autoMaintainController.signal)

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
