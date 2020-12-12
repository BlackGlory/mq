interface ISignalDAO {
  emit(key: string): void
  wait(key: string): Promise<void>
}
