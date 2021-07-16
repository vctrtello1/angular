import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LOGIN, Login, LoginFail, LoginStart, LOGIN_START } from "./auth.actions";


export interface AuthResponseData {
  idToken: string,
  email: string,

  refresh_token: string,
  id_token: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(LOGIN_START),
    switchMap((authData: LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new Login({
            email: resData.email, userId: resData.localId,
            token: resData.idToken, expirationDate: expirationDate
          });
        }),
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            return of(new LoginFail(errorMessage));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'The email already exists.';
              break;
            case 'OPERATION_NOT_ALLOWED':
              errorMessage = 'Password sign-in is disabled for this project.';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'The password is invalid or the user does not have a password.';
              break;
            case 'USER_DISABLED':
              errorMessage = 'The user account has been disabled by an administrator.';
              break;
          }
          return of(new LoginFail(errorMessage));
        }),
      )
    })
  );

  @Effect(
    {
      dispatch: false
    }
  )
  authSuccess = this.actions$.pipe(
    ofType(LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
    );

  constructor(private actions$: Actions,
    private http: HttpClient,
    private router: Router) {}
}
