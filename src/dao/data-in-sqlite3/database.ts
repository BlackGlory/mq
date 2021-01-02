import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import * as fs from 'fs-extra'
import { NODE_ENV, NodeEnv } from '@env'
import { strict as assert } from 'assert'
import { enableAutoVacuum, vaccum, enableForeignKeys, migrateDatabase } from './utils'
assert(NODE_ENV() !== NodeEnv.Test)

let db: IDatabase

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export function closeDatabase(): void {
  if (db) db.close()
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
  vaccum(db)
}

export function connectDatabase(): IDatabase {
  const dataPath = path.join(appRoot, 'data')
  const dataFilename = path.join(dataPath, 'data.db')
  fs.ensureDirSync(dataPath)

  db = new Database(dataFilename)
  enableForeignKeys(db)
  enableAutoVacuum(db)
  return db
}
