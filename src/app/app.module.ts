import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'ngx-moment';

import { AppComponent } from './app.component';
import { LastActiveComponent } from './components/last-active/last-active.component';
import { LastActiveService } from './services/last-active.service';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';

@NgModule({
  declarations: [
    AppComponent,
    LastActiveComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MomentModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [LastActiveService],
      useFactory: (lastActiveService: LastActiveService) => () =>
        lastActiveService.setUp(),
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [LoginService],
      useFactory: (loginService: LoginService) => () =>
        loginService.setUp(),
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
