import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { hash } from './utils/hash'
import { BadMessageState, DuplicatePayload, NotFound } from './error'
import { downcreaseDrafting, increaseWaiting } from './utils/stats'
import { State } from './utils/state'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export const setMessage = withLazyStatic(function (
  namespace: string
, id: string
, type: string
, payload: string
, unique: boolean = false
): void {
  lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  , type: string
  , payload: string
  , unique: boolean = false
  ) => {
    const timestamp = getTimestamp()

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id })
    if (!row) throw new NotFound()

    if (
      row.state !== State.Drafting &&
      row.state !== State.Waiting
    ) {
      throw new BadMessageState(State.Drafting, State.Waiting)
    }

    const oldState = row['state'] as State.Drafting | State.Waiting

    const payloadHash = hash(payload)
    if (unique && hasDuplicatePayload(namespace, id, payloadHash)) {
      throw new DuplicatePayload()
    }

    const completeDraftingMessage = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
          SET type = $type
            , payload = $payload
            , hash = $hash
            , state = 'waiting'
            , state_updated_at = $stateUpdatedAt
        WHERE namespace = $namespace
          AND id = $id;
    `), [getDatabase()])
    
    const updateDraftingMessage = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
          SET type = $type
            , payload = $payload
            , hash = $hash
        WHERE namespace = $namespace
          AND id = $id;
    `), [getDatabase()])

    if (oldState === State.Drafting) {
      completeDraftingMessage.run({
        namespace
      , id
      , type
      , payload
      , hash: payloadHash
      , stateUpdatedAt: timestamp
      })

      downcreaseDrafting(namespace)
      increaseWaiting(namespace)
    } else {
      updateDraftingMessage.run({
        namespace
      , id
      , type
      , payload
      , hash: payloadHash
      })
    }
  }), [getDatabase()])(namespace, id, type, payload, unique)
})

const hasDuplicatePayload = withLazyStatic(function (
  namespace: string
, id: string
, hash: string
): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM mq_message
              WHERE namespace = $namespace
                AND id != $id
                AND hash = $hash
           ) AS matched;
  `), [getDatabase()]).get({ namespace, id, hash })

  return !!result['matched']
})
