import * as DAO from '@dao/config-in-sqlite3/configuration/configuration'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { Database } from 'better-sqlite3'
import { resetEnvironment, resetDatabases } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('Configuration', () => {
  describe('getAllIdsWithConfigurations(): string[]', () => {
    it('return string[]', async () => {
      const db = getDatabase()
      const id = 'id'
      insert(db, id, {
        unique: true
      , draftingTimeout: null
      , orderedTimeout: null
      , activeTimeout: null
      , concurrency: null
      , throttle: null
      })

      const result = DAO.getAllIdsWithConfigurations()

      expect(result).toEqual([id])
    })
  })

  describe('getConfigurations(mqId: string): Configurations', () => {
    describe('exists', () => {
      it('return', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: true
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })

        const result = DAO.getConfigurations(id)

        expect(result).toEqual({
          unique: true
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })
      })
    })

    describe('does not exist', () => {
      it('return', async () => {
        const id = 'id'

        const result = DAO.getConfigurations(id)

        expect(result).toEqual({
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })
      })
    })
  })

  describe('setUnique(mqId: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setUnique(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['uniq']).toBe(1)
    })
  })

  describe('unsetUnique(mqId: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: 100
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })

        const result = DAO.unsetUnique(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['uniq']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetUnique(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setDraftingTimeout(mqId: string, val: number): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setDraftingTimeout(id, 100)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['drafting_timeout']).toBe(100)
    })
  })

  describe('unsetDraftingTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: 100
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })

        const result = DAO.unsetDraftingTimeout(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['drafting_timeout']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetDraftingTimeout(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setOrderedTimeout(mqId: string, val: number): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setOrderedTimeout(id, 100)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['ordered_timeout']).toBe(100)
    })
  })

  describe('unsetOrderedTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: null
        , orderedTimeout: 100
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })

        const result = DAO.unsetOrderedTimeout(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['ordered_timeout']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetOrderedTimeout(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setActiveTimeout(mqId: string, val: number): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setActiveTimeout(id, 100)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['active_timeout']).toBe(100)
    })
  })

  describe('unsetActiveTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: 100
        , concurrency: null
        , throttle: null
        })

        const result = DAO.unsetActiveTimeout(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['active_timeout']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetActiveTimeout(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setConcurrency(mqId: string, val: number): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setConcurrency(id, 100)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['concurrency']).toBe(100)
    })
  })

  describe('unsetConcurrency(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: 100
        , concurrency: null
        , throttle: null
        })

        const result = DAO.unsetConcurrency(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['concurrency']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetConcurrency(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setThrottle(mqId: string, val: Throttle): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setThrottle(id, {
        duration: 100
      , limit: 200
      })
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['throttle_duration']).toBe(100)
      expect(row['throttle_limit']).toBe(200)
    })
  })

  describe('unsetThrottle(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: {
            duration: 100
          , limit: 200
          }
        })

        const result = DAO.unsetThrottle(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['throttle_duration']).toBeNull()
        expect(row['throttle_limit']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetThrottle(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})


function exist(db: Database, id: string) {
  return !!select(db, id)
}

function select(db: Database, id: string) {
  return db.prepare(`
    SELECT *
      FROM mq_configuration
     WHERE mq_id = $id;
  `).get({ id })
}

function insert(
  db: Database
, id: string
, {
    unique
  , draftingTimeout
  , orderedTimeout
  , activeTimeout
  , concurrency
  , throttle
  }: Configurations
) {
  db.prepare(`
    INSERT INTO mq_configuration (
      mq_id
    , uniq
    , drafting_timeout
    , ordered_timeout
    , active_timeout
    , concurrency
    , throttle_duration
    , throttle_limit
    )
    VALUES (
      $id
    , $unique
    , $draftingTimeout
    , $orderedTimeout
    , $activeTimeout
    , $concurrency
    , $throttleDuration
    , $throttleLimit
    );
  `).run({
    id
  , unique: unique === null ? null : booleanToNumber(unique)
  , draftingTimeout
  , orderedTimeout
  , activeTimeout
  , concurrency
  , throttleDuration: throttle?.duration ?? null
  , throttleLimit: throttle?.limit ?? null
  })
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
