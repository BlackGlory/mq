export class Station<T> {
  #map = new Map<string, T>()

  constructor(private create: () => T) {}

  get(key: string): T {
    if (!this.#map.has(key)) this.#map.set(key, this.create())
    return this.#map.get(key)!
  }

  refresh(key: string) {
    this.#map.set(key, this.create())
  }
}
