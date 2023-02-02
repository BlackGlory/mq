import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { ITokenInfo } from './contract.js'

export const getAllNamespacesWithTokens = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_token;
  `), [getDatabase()]).all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const getAllTokens = withLazyStatic(function (namespace: string): ITokenInfo[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT token
         , produce_permission
         , consume_permission
         , clear_permission
      FROM mq_token
     WHERE namespace = $namespace;
  `), [getDatabase()]).all({ namespace }) as Array<{
    token: string
    produce_permission: number
    consume_permission: number
    clear_permission: number
  }>

  return result.map(x => ({
    token: x['token']
  , produce: x['produce_permission'] === 1
  , consume: x['consume_permission'] === 1
  , clear: x['clear_permission'] === 1
  }))
})

export const hasProduceTokens = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND produce_permission = 1
           ) AS produce_tokens_exist;
  `), [getDatabase()]).get({ namespace }) as { produce_tokens_exist: 1 | 0 }

  return result['produce_tokens_exist'] === 1
})

export const matchProduceToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND produce_permission = 1
           ) AS matched;
  `), [getDatabase()]).get({ token, namespace }) as { matched: 1 | 0 }

  return result['matched'] === 1
})

export const setProduceToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, produce_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET produce_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetProduceToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token
         SET produce_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])(params)
})

export const hasConsumeTokens = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND consume_permission = 1
           ) AS consume_tokens_exist
  `), [getDatabase()]).get({ namespace }) as { consume_tokens_exist: 1 | 0 }

  return result['consume_tokens_exist'] === 1
})

export const matchConsumeToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND consume_permission = 1
           ) AS matched
  `), [getDatabase()]).get({ token, namespace }) as { matched: 1 | 0 }

  return result['matched'] === 1
})

export const setConsumeToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, consume_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET consume_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetConsumeToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token
         SET consume_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])({ token, namespace })
})

export const matchClearToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND clear_permission = 1
           ) AS matched
  `), [getDatabase()]).get({ token, namespace }) as { matched: 1 | 0 }

  return result['matched'] === 1
})

export const setClearToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, clear_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET clear_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetClearToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token
         SET clear_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])({ token, namespace })
})

const deleteNoPermissionToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM mq_token
     WHERE token = $token
       AND namespace = $namespace
       AND produce_permission = 0
       AND consume_permission = 0
       AND clear_permission = 0;
  `), [getDatabase()]).run({ token, namespace })
})
