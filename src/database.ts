import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import * as path from 'path'
import { ensureDirSync } from 'extra-filesystem'
import { DATA, NODE_ENV, NodeEnv } from '@env/index.js'
import { assert } from '@blackglory/errors'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { map } from 'extra-promise'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import { getAppRoot } from '@utils/get-app-root.js'

let db: IDatabase

export function openDatabase(): void {
  switch (NODE_ENV()) {
    case NodeEnv.Test: {
      db = new Database(':memory:')
      break
    }
    default: {
      const dataPath = DATA()
      const dataFilename = path.join(dataPath, 'data.db')
      ensureDirSync(dataPath)

      db = new Database(dataFilename)
    }
  }

  enableForeignKeys(db)
}

export async function prepareDatabase(): Promise<void> {
  assert(db, 'Database is not opened')

  await migrateDatabase(db)
  db.unsafeMode(true)
}

export function getDatabase() {
  assert(db, 'Database is not opened')
  return db
}

export function closeDatabase() {
  if (db) {
    db.exec(`
      PRAGMA analysis_limit=400;
      PRAGMA optimize;
    `)
    db.close()
  }
}

async function migrateDatabase(db: IDatabase): Promise<void> {
  const migrationsPath = path.join(getAppRoot(), 'migrations')
  const migrations = await map(
    await findMigrationFilenames(migrationsPath)
  , readMigrationFile
  )
  migrate(db, migrations)
}

function enableForeignKeys(db: IDatabase): void {
  db.exec('PRAGMA foreign_keys = ON;')
}
