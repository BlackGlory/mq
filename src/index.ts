import { go } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'
import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { callNextTickEverySecond } from './schedule.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const server = await buildServer()
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
