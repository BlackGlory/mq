import { go } from '@blackglory/prelude'
import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { startServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'
import { startMaintainer } from './maintainer.js'

go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const stopMaintainer = startMaintainer()
  youDied(stopMaintainer)

  const closeServer = startServer(HOST(), PORT())
  youDied(closeServer)
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
