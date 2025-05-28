import { MessageState } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export function increaseStatByState(queueId: string, state: MessageState, num: number): void {
  switch (state) {
    case MessageState.Drafting: increaseDrafting(queueId, num); break
    case MessageState.Waiting: increaseWaiting(queueId, num); break
    case MessageState.Ordered: increaseOrdered(queueId, num); break
    case MessageState.Active: increaseActive(queueId, num); break
    case MessageState.Failed: increaseFailed(queueId, num); break
    case MessageState.Completed: increaseCompleted(queueId, num); break
    case MessageState.Abandoned: increaseAbandoned(queueId, num); break
  }
}

export const increaseDrafting = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET drafting = drafting + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseWaiting = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET waiting = waiting + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseOrdered = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET ordered = ordered + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseActive = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET active = active + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseFailed = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET failed = failed + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseCompleted = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET completed = completed + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})

export const increaseAbandoned = withLazyStatic((
  queueId: string
, num: number
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    num: number
  }>(`
    UPDATE mq_queue
       SET abandoned = abandoned + $num
     WHERE id = $queueId;
  `), [getDatabase()]).run({
    queueId
  , num
  })
})
