import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, mergeMap, fromEvent, throttleTime, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LastActiveService {
  private recordTimeoutMs: number = 500;
  private localStorageKey: string = '__lastActive';
  private events: string[] = ['keydown', 'click', 'wheel', 'mousemove'];

  private lastActive: BehaviorSubject<Date>;
  public lastActive$: Observable<Date>;

  constructor() {
    const lastActiveDate = this.getLastActiveFromLocalStorage() ?? new Date();
    this.lastActive = new BehaviorSubject<Date>(lastActiveDate);
    this.lastActive$ = this.lastActive.asObservable();
  }

  public setUp() {
    from(this.events).pipe(mergeMap(event => fromEvent(document, event)), throttleTime(this.recordTimeoutMs)).subscribe(_ => this.recordLastActiveDate());

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter(event => event.storageArea === localStorage
          && event.key === this.localStorageKey
          && !!event.newValue),
        map(event => new Date(event.newValue!))
      )
      .subscribe(newDate => this.lastActive.next(newDate));
  }

  public getLastActiveDate(): Date {
    return this.lastActive.value;
  }

  private recordLastActiveDate() {
    var currentDate = new Date();
    localStorage.setItem(this.localStorageKey, currentDate.toString());
    this.lastActive.next(currentDate);
  }

  private getLastActiveFromLocalStorage(): Date | null {
    const valueFromStorage = localStorage.getItem(this.localStorageKey);
    if (!valueFromStorage) {
      return null;
    }

    return new Date(valueFromStorage);
  }
}
