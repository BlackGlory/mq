import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import { migrateDatabase, enableAutoVacuum } from '../utils'
import { strict as assert } from 'assert'

let db: IDatabase

export function openDatabase(): void {
  db = new Database(':memory:')
  enableAutoVacuum(db)
}

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function closeDatabase(): void {
  if (db) db.close()
}
