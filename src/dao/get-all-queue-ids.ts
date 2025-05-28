import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllQueueIds = withLazyStatic((): string[] => {
  const rows = lazyStatic(() => getDatabase().prepare<[], { id: string }>(`
    SELECT id
      FROM mq_queue;
  `), [getDatabase()]).all()

  return rows.map(row => row.id)
})
