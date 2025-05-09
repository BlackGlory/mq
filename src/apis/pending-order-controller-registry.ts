export class PendingOrderControllerRegistry {
  private static controllers: Map<string, Set<AbortController>> = new Map()

  static register(namespace: string, controller: AbortController): null {
    if (!this.controllers.has(namespace)) {
      this.controllers.set(namespace, new Set())
    }
    this.controllers.get(namespace)!.add(controller)

    return null
  }

  static unregister(namespace: string, controller: AbortController): null {
    this.controllers.get(namespace)?.delete(controller)

    return null
  }

  static abortAll(namespace: string): null {
    this.controllers.get(namespace)?.forEach(controller => controller.abort())
    this.controllers.set(namespace, new Set())

    return null
  }
}
