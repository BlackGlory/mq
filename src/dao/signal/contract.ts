import { Observable } from 'rxjs'

export interface ISignalDAO {
  emit(namespace: string): void
  observe(namespace: string): Observable<void>
}
