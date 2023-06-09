import { Injectable } from '@angular/core';
import { Auth, signInWithRedirect } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/states';
import { authActions } from '../../store/authentication/authentication';
import * as firebaseAuth from 'firebase/auth';
import { from, Observable, Subject, EMPTY, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser } from 'shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleAuthProvider = new firebaseAuth.GoogleAuthProvider();
  userS = new ReplaySubject<firebaseAuth.User | null>(1);
  firebaseUser$ = new ReplaySubject<IUser | null>(1)
  firebaseUser: IUser | null = null;

  constructor(
    private afAuth: Auth,
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.userS.subscribe(async (user) => {
      const fbUser = await userService.get(user?.uid);
      const completeFbUser = user ? {...fbUser, id: user?.uid} as IUser : null
      this.firebaseUser = completeFbUser
      this.firebaseUser$.next(completeFbUser)

      store.dispatch(authActions.setFetching({ isFetching: false }));

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

      if (returnUrl) {
        router.navigateByUrl(returnUrl);
        console.log('redirected');
      }
      else {
        if (router.routerState.snapshot.url === '/login')
        router.navigate(['/'])
      }
    });

    afAuth.onAuthStateChanged(async (user) => {
      if (user) {
        await userService.save(user);
      }
      this.userS.next(user);
      
    });
  }

  login() {
    signInWithRedirect(this.afAuth, this.googleAuthProvider);
    this.store.dispatch(authActions.setFetching({ isFetching: true }));
  }
  logout() {
    this.afAuth.signOut();
  }

  // get fbUser(){
  //   return firebaseAuth.
  // }
}
