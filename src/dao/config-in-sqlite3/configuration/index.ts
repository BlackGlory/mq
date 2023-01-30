import * as Configuration from './configuration.js'

export const ConfigurationDAO: IConfigurationDAO = {
  getAllNamespacesWithConfiguration: asyncify(Configuration.getAllIdsWithConfiguration)
, getConfiguration: asyncify(Configuration.getConfiguration)

, setUnique: asyncify(Configuration.setUnique)
, unsetUnique: asyncify(Configuration.unsetUnique)

, setDraftingTimeout: asyncify(Configuration.setDraftingTimeout)
, unsetDraftingTimeout: asyncify(Configuration.unsetDraftingTimeout)

, setOrderedTimeout: asyncify(Configuration.setOrderedTimeout)
, unsetOrderedTimeout: asyncify(Configuration.unsetOrderedTimeout)

, setActiveTimeout: asyncify(Configuration.setActiveTimeout)
, unsetActiveTimeout: asyncify(Configuration.unsetActiveTimeout)

, setConcurrency: asyncify(Configuration.setConcurrency)
, unsetConcurrency: asyncify(Configuration.unsetConcurrency)
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
