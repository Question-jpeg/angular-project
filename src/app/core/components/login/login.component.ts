import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/states';
import { AuthService } from 'shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isInProcess$

  constructor(private afAuthService: AuthService, private ngStore: Store<IAppState>) {
    this.isInProcess$ = ngStore.select('authentication', 'isFetching')
  }

  login() {
    this.afAuthService.login();
  }
}
