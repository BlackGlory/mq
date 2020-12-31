import { AbortController } from 'abort-controller'
import {
  prepareDatabase as prepareConfigInSqlite3Database
, closeDatabase as closeConfigInSqlite3Database
} from '@dao/config-in-sqlite3/database'
import {
  prepareDatabase as prepareDataInSqlite3Database
, closeDatabase as closeDataInSqlite3Database
} from '@dao/data-in-sqlite3/database'
import { autoMaintain } from '@core/mq'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

const autoMaintainController = new AbortController()

process.on('exit', () => {
  autoMaintainController.abort()
  closeDataInSqlite3Database()
  closeConfigInSqlite3Database()
})
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

;(async () => {
  await prepareConfigInSqlite3Database()
  await prepareDataInSqlite3Database()
  autoMaintain(autoMaintainController.signal)

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
