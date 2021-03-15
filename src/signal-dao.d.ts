interface ISignalDAO {
  emit(key: string): void
  observe(key: string): import('rxjs').Observable<void>
}
