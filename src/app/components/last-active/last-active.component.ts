import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { LastActiveService } from '../../services/last-active.service';

@Component({
  selector: 'app-last-active',
  templateUrl: './last-active.component.html',
  styleUrls: ['./last-active.component.scss'],
})
export class LastActiveComponent {
  public lastActiveDate$: Observable<Date>;

  constructor(lastActiveService: LastActiveService) {
    this.lastActiveDate$ = lastActiveService.lastActive$;
  }
}
