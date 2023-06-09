import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { from, map, Observable } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const observable = this.auth.userS.pipe(
      map((user) => {
        if (user) return true;
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
    
    return observable
  }
}
