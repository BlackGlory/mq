import { CustomError } from '@blackglory/errors'
import { JSONObject, JSONValue, NonEmptyArray } from 'justypes'
import { getEnumKey } from 'extra-utils'

/**
 * 区分`oredred`和`active`是因为取出消息id的和处理消息的可能是两个不同的实体,
 * 这种细粒度的状态设计可以更有效地利用带宽等资源.
 */
export enum MessageState {
  Drafting = 0
, Waiting = 1
, Ordered = 2
, Active = 3
, Failed = 4
, Completed = 5
, Abandoned = 6
}

export enum AdditionalBehavior {
  None = 0

  /**
   * 删除消息.
   * 
   * 这不会影响对应状态的统计数据.
   * 当队列要求消息唯一时, 该行为将导致相同的消息可以再次入列.
   */
, RemoveMessage = 1

  /**
   * 删除插槽以节省存储空间.
   */
, RemoveAllSlots = 2
}

export interface IQueueConfig extends JSONObject {
  /**
   * 是否维持消息的唯一性.
   * 
   * 启用此选项后, 该消息队列的写入性能将会因为去重而大幅降低.
   */
  unique: boolean

  /**
   * 允许消息处于`drafting`状态的毫秒数.
   */
  draftingTimeout: number

  /**
   * 允许消息处于`ordered`状态的毫秒数.
   */
  orderedTimeout: number

  /**
   * 允许消息处于`active`状态的毫秒数.
   */
  activeTimeout: number

  /**
   * 允许处于`ordered`和`active`状态的消息数量.
   * 
   * `null`表示无限.
   */
  concurrency: number | null

  behaviorWhenCompleted: AdditionalBehavior
  behaviorWhenAbandoned: AdditionalBehavior
}

export interface IMessage {
  slots: Record<string, JSONValue>
  priority: number | null
  state: MessageState
}

export interface IQueueStats {
  drafting: number
  waiting: number
  ordered: number
  active: number
  failed: number
  completed: number
  abandoned: number
}

export interface IAPI {
  getAllQueueIds(): string[]

  getQueue(queueId: string): IQueueConfig | null

  /**
   * 队列已存在的情况下, 调用该方法会更新队列的配置, 但有以下注意事项:
   * - 由于旧消息缺乏相应的字段, 旧消息不会因为`unique`启用而去重, 且新消息仍可能会与旧消息的内容重复.
   * - 已经处于`completed`状态的消息不受`behaviorWhenCompleted`的改变影响.
   * - 已经处于`abandoned`状态的消息不受`behaviorWhenAbandoned`的改变影响.
   */
  setQueue(queueId: string, config: IQueueConfig): null

  removeQueue(queueId: string): null

  getQueueStats(queueId: string): IQueueStats | null

  /**
   * 重置队列:
   * - 清空队列中的消息.
   * - 重置统计数据.
   */
  resetQueue(queueId: string): null

  /**
   * 产生一个处于`drafting`状态的消息.
   * 
   * @param priority 消息的优先级, 有符号整数, 值越大则优先级越大.
   * `null`为特殊值, 表示无优先级, 代表优先级最低.
   * 如果需要设置优先级, 推荐做法是将`0`视作默认优先级, 在此基础上调整优先级.
   * @throws {QueueNotFound}
   * @throws {DuplicateMessageId}
   */
  draftMessage(
    queueId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , messageId?: string
  ): string

  /**
   * 当消息的每个slot都有值时, 消息将从`drafting`转为`waiting`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {MessageNotFound}
   * @throws {SlotNotFound}
   * @throws {BadMessageState}
   * @throws {DuplicateMessage}
   */
  setMessageSlot(
    queueId: string
  , messageId: string
  , slotName: string
  , value: JSONValue
  ): null

  /**
   * 从队列中取出一个处于`waiting`状态的消息的id.
   * 该消息将转为`ordered`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {AbortError}
   */
  orderMessage(queueId: string): Promise<string>

  /**
   * 获取一个消息.
   * 对于处于`ordered`状态的消息, 该方法存在副作用, 将导致该消息转为`active`状态.
   * 
   * @throws {QueueNotFound}
   */
  getMessage(queueId: string, messageId: string): IMessage | null

  /**
   * 无副作用地获取一个消息.
   * 
   * @throws {QueueNotFound}
   */
  peekMessage(queueid: string, messageId: string): IMessage | null

  /**
   * 将一个处于`active`状态的消息转为`completed`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {MessageNotFound}
   * @throws {BadMessageState}
   */
  completeMessage(queueId: string, messageId: string): null

  /**
   * 将一个处于`active`状态的消息转为`failed`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {MessageNotFound}
   * @throws {BadMessageState}
   */
  failMessage(queueId: string, messageId: string): null

  /**
   * 将一个处于`renew`状态的消息转为`waiting`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {MessageNotFound}
   * @throws {BadMessageState}
   */
  renewMessage(queueId: string, messageId: string): null

  /**
   * 将一个消息转为`abandoned`状态.
   * 
   * @throws {QueueNotFound}
   * @throws {MessageNotFound}
   */
  abandonMessage(queueId: string, messageId: string): null

  /**
   * @throws {QueueNotFound}
   */
  removeMessage(queueId: string, messageId: string): null

  /**
   * @throws {QueueNotFound}
   */
  abandonAllFailedMessages(queueId: string): null

  /**
   * @throws {QueueNotFound}
   */
  renewAllFailedMessages(queueId: string): null

  /**
   * @throws {QueueNotFound}
   */
  getMessageIdsByState(queueId: string, state: MessageState): string[]

  /**
   * 根据状态清空队列中的消息.
   * 统计数据的对应项目将减去删除的消息数量.
   * 
   * @throws {QueueNotFound}
   */
  clearMessagesByState(queueId: string, state: MessageState): null
}

export class QueueNotFound extends CustomError {}
export class MessageNotFound extends CustomError {}
export class SlotNotFound extends CustomError {}
export class DuplicateMessage extends CustomError {}
export class DuplicateMessageId extends CustomError {}

export class BadMessageState extends CustomError {
  constructor(...requiredStates: NonEmptyArray<MessageState>) {
    if (requiredStates.length === 1) {
      super(`The state of message must be "${getEnumKey(MessageState, requiredStates[0])}"`)
    } else {
      const text = requiredStates
        .map(x => `"${getEnumKey(MessageState, x)}"`)
        .join(', ')
      super(`The state of message must be one of ${text}`)
    }
  }
}
