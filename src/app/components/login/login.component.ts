import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loggedIn$: Observable<boolean>;

  constructor(private loginService: LoginService) {
    this.loggedIn$ = loginService.loggedIn$;
  }

  public logIn() {
    this.loginService.logIn();
  }
}
