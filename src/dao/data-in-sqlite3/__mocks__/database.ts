import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import { migrateDatabase, enableForeignKeys } from '../utils'
import { assert } from '@blackglory/errors'

let db: IDatabase

export function openDatabase(): void {
  db = new Database(':memory:')
  enableForeignKeys(db)
}

export async function prepareDatabase(): Promise<void> {
  assert(db, 'Database is not opened')
  await migrateDatabase(db)
}

export function getDatabase(): IDatabase {
  assert(db, 'Database is not opened')
  return db
}

export function closeDatabase(): void {
  if (db) db.close()
}
