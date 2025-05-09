import { go } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'
import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { callNextTickEverySecond } from './schedule.js'
import { startServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const closeServer = startServer(HOST(), PORT())
  youDied(closeServer)
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  const maintainController = new AbortController()
  callNextTickEverySecond(maintainController.signal)
  youDied(() => maintainController.abort())

  process.send?.('ready')
})
