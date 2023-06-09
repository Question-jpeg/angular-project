import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, switchMap, from } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';
import { UserService } from 'shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const observable = this.auth.userS.pipe(
      switchMap((user) => {
        if (user) {
          return from(this.userService.get(user.uid));
        }
        return from([null]);
      }),
      map((fbUser) => {
        if (fbUser) {
          if (fbUser.isAdmin) return true;
          this.router.navigate(['/']);
          return false;
        }
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );

    return observable;
  }
}
