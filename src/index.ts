import { go } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'
import * as Config from '@dao/config/database.js'
import * as Data from '@dao/data/database.js'
import { callNextTickEverySecond } from './schedule.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

go(async () => {
  Config.openDatabase()
  youDied(() => Config.closeDatabase())
  await Config.prepareDatabase()

  Data.openDatabase()
  youDied(() => Data.closeDatabase())
  await Data.prepareDatabase()

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
