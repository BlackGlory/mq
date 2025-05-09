import { WS_HEARTBEAT_INTERVAL, NODE_ENV, NodeEnv } from '@env/index.js'
import { API } from '@apis/index.js'
import { WebSocket, WebSocketServer } from 'ws'
import { createServer, Level } from '@delight-rpc/websocket'
import { readJSONFileSync } from 'extra-filesystem'
import { Destructor } from 'extra-defer'
import { setDynamicTimeoutLoop } from 'extra-timers'
import { getPackageFilename } from '@utils/get-package-filename.js'
import { pass } from '@blackglory/prelude'

export function startServer(host: string, port: number): () => Promise<void> {
  const pkg = readJSONFileSync<{
    version: `${number}.${number}.${number}`
  }>(getPackageFilename())

  const sockets = new Set<WebSocket>()

  const server = new WebSocketServer({ host, port })
  server.on('connection', socket => {
    const destructor = new Destructor()

    sockets.add(socket)
    destructor.defer(() => sockets.delete(socket))

    const close = createServer(API, socket, {
      loggerLevel: NODE_ENV() === NodeEnv.Test ? Level.None : Level.Info
    , version: pkg.version
    })
    destructor.defer(close)

    const cancelHeartbeatTimer: (() => void) | null = WS_HEARTBEAT_INTERVAL() > 0
      ? setDynamicTimeoutLoop(WS_HEARTBEAT_INTERVAL(), () => socket.ping())
      : null
    destructor.defer(() => cancelHeartbeatTimer?.())

    socket.once('close', () => {
      destructor.execute().catch(pass)
    })
  })

  return () => new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err) return reject(err)
      resolve()
    })
    server.clients.forEach(socket => socket.close())
  })
}
