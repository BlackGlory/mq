interface ISignalDAO {
  emit(namespace: string): void
  observe(namespace: string): import('rxjs').Observable<void>
}
