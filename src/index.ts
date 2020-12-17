import { AbortController } from 'abort-controller'
import { prepareDatabase as prepareConfigInSqlite3Database } from '@dao/config-in-sqlite3/database'
import { prepareDatabase as prepareDataInSqlite3Database } from '@dao/data-in-sqlite3/database'
import { autoMaintain } from '@core/mq'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

const autoMaintainController = new AbortController()

process.on('SIGHUP', () => {
  autoMaintainController.abort()
  process.exit(1)
})

;(async () => {
  await prepareConfigInSqlite3Database()
  await prepareDataInSqlite3Database()
  autoMaintain(autoMaintainController.signal)

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
