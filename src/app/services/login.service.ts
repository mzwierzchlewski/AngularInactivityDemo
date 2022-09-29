import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, timer, filter, fromEvent, map } from 'rxjs';

import { LastActiveService } from './last-active.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private inactivityLogoutTimeoutS: number = 10;
  private timerTickMs: number = 500;
  private localStorageKey: string = '__loggedIn';

  private loggedIn: BehaviorSubject<boolean>;
  public loggedIn$: Observable<boolean>;

  constructor(private lastActiveService: LastActiveService) {
    this.loggedIn = new BehaviorSubject(
      this.getLoggedInFromLocalStorage() ?? false
    );
    this.loggedIn$ = this.loggedIn.asObservable();
  }

  public logIn() {
    localStorage.setItem(this.localStorageKey, 'true');
    this.loggedIn.next(true);
  }

  private logOut() {
    localStorage.removeItem(this.localStorageKey);
    this.loggedIn.next(false);
  }

  public setUp() {
    timer(0, this.timerTickMs)
      .pipe(filter(_ => this.loggedIn.value))
      .subscribe(_ => {
        const currentDate = moment(new Date());
        const lastActiveDate = this.lastActiveService.getLastActiveDate();
        if (moment.duration(currentDate.diff(lastActiveDate)).asSeconds() > this.inactivityLogoutTimeoutS) {
          this.logOut();
        }
      });

      fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter(event => event.storageArea === localStorage
          && event.key === this.localStorageKey),
        map(event => !!event.newValue)
      )
      .subscribe(loggedIn => {
        this.loggedIn.next(loggedIn);
      });
  }

  private getLoggedInFromLocalStorage(): boolean | null {
    const valueFromStorage = localStorage.getItem(this.localStorageKey);
    if (!valueFromStorage) {
      return null;
    }

    return !!valueFromStorage;
  }
}
