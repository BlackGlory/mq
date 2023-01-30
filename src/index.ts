import { go } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database.js'
import * as DataInSqlite3 from '@dao/data-in-sqlite3/database.js'
import { callNextTickEverySecond } from './schedule.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSqlite3.openDatabase()
  youDied(() => ConfigInSqlite3.closeDatabase())
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  youDied(() => DataInSqlite3.closeDatabase())
  await DataInSqlite3.prepareDatabase()

  const server = buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  const maintainController = new AbortController()
  callNextTickEverySecond(maintainController.signal)
  youDied(() => maintainController.abort())

  process.send?.('ready')
})
