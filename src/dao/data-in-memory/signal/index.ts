import { EventEmitter } from 'events'
import { Observable, fromEvent } from 'rxjs'
import { first, map } from 'rxjs/operators'

const emitter = new EventEmitter()

export const SignalDAO: ISignalDAO = {
  emit(namespace: string): void {
    emitter.emit(namespace, undefined)
  }

  // 使用Observable是因为操作可以退订, 从而避免event listener泄漏
, observe(namespace: string): Observable<void> {
    return fromEvent(emitter, namespace)
      .pipe(
        first()
      , map(() => undefined)
      )
  }
}
