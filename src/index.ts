import { go } from '@blackglory/prelude'
import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { startServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'
import { nextTick } from '@apis/mq.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms from 'ms'

go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const stopTickLoop = startTickLoop()
  youDied(stopTickLoop)

  const closeServer = startServer(HOST(), PORT())
  youDied(closeServer)
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})

function startTickLoop(): () => void {
  return setDynamicTimeoutLoop(ms('1s'), nextTick)
}
