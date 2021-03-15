import { EventEmitter } from 'events'
import { Observable, fromEvent } from 'rxjs'
import { first } from 'rxjs/operators'

const emitter = new EventEmitter()

export const SignalDAO: ISignalDAO = {
  emit(key: string): void {
    emitter.emit(key, null)
  }

  // 使用Observable是因为操作可以退订, 从而避免event listener泄漏
, observe(key: string): Observable<void> {
    return fromEvent(emitter, key)
      .pipe(first())
  }
}
