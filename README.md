# MQ
提供以WebSocket为通讯协议的持久化消息队列.

## Quickstart
```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/mq
```

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/mq
cd mq
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/mq
cd mq
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  mq:
    image: 'blackglory/mq'
    restart: always
    volumes:
      - 'mq-data:/data'
    ports:
      - '8080:8080'

volumes:
  mq-data:
```

## API
```ts
interface IConfiguration {
  unique: boolean | null
  draftingTimeout: number | null
  orderedTimeout: number | null
  activeTimeout: number | null
  concurrency: number | null
}

interface IMessage {
  type: string
  payload: string
  priority: number | null
}

interface IStats {
  namespace: string
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
  failed: number
}

interface IAPI {
  MQ: {
    draft(namespace: string, priority: number | null): string

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     * @throws {DuplicatePayload}
     */
    set(
      namespace: string
    , messageId: string
    , type: string
    , payload: string
    ): null

    /**
     * @throws {AbortError}
     */
    order(namespace: string, abortSignal: AbortSignal): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    get(namespace: string, messageId: string): IMessage

    /**
     * @throws {NotFound}
     */
    abandon(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    complete(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    fail(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    renew(namespace: string, messageId: string): null

    abandonAllFailedMessages(namespace: string): null
    renewAllFailedMessages(namespace: string): null

    getAllFailedMessageIds(namespace: string): string[]
    getAllNamespaces(): string[]

    clear(namespace: string): null
    stats(namespace: string): IStats
  }

  Configuration: {
    getAllNamespaces(): string[]
    get(namespace: string): IConfiguration

    setUnique(namespace: string, val: boolean): null
    unsetUnique(namespace: string): null

    setDraftingTimeout(namespace: string, val: number): null
    unsetDraftingTimeout(namespace: string): null

    setOrderedTimeout(namespace: string, val: number): null
    unsetOrderedTimeout(namespace: string): null

    setActiveTimeout(namespace: string, val: number): null
    unsetActiveTimeout(namespace: string): null

    setConcurrency(namespace: string, val: number): null
    unsetConcurrency(namespace: string): null
  }
}

class NotFound extends CustomError {}
class BadMessageState extends CustomError {}
class DuplicatePayload extends CustomError {}
```

## 环境变量
### `MQ_HOST`, `MQ_PORT`
通过环境变量`MQ_HOST`和`MQ_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### `MQ_WS_HEARTBEAT_INTERVAL`
通过环境变量`MQ_WS_HEARTBEAT_INTERVAL`可以设置WS心跳包(ping帧)的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`MQ_WS_HEARTBEAT_INTERVAL`大于零时,
服务会通过WS的ping帧按间隔发送心跳包.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/mq-js>
