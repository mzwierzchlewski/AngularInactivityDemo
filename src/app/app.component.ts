import { Component } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  constructor() {
    moment.updateLocale('en', {
      relativeTime: {
        s: function (number, withoutSuffix, key, isFuture) {
          return number + ' seconds';
        },
      },
    });
  }
}
