export interface IJSONSchemaDAO {
  getAllNamespacesWithJSONSchema(): string[]
  getJSONSchema(namespace: string): string | null
  setJSONSchema(params: {
    namespace: string
    schema: string
  }): void
  removeJSONSchema(namespace: string): void
}
