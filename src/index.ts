import { prepareDatabase as prepareConfigInSqlite3Database } from '@src/dao/config-in-sqlite3/database'
import { prepareDatabase as prepareDataInSqlite3Database } from '@src/dao/data-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await prepareConfigInSqlite3Database()
  await prepareDataInSqlite3Database()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
