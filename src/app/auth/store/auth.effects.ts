import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthenticateFail, AuthenticateSuccess, AUTHENTICATE_SUCCESS, LoginStart, LOGIN_START, SignupStart, SIGNUP_START } from "./auth.actions";


export interface AuthResponseData {
  idToken: string,
  email: string,

  refresh_token: string,
  id_token: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleAuthentication = (expiresIn: number, email: string, userId: string,
  token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  return new AuthenticateSuccess({
    email: email, userId: userId,
    token: token, expirationDate: expirationDate
  });
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthenticateFail(errorMessage));
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
  return of(new AuthenticateFail(errorMessage));

}

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(SIGNUP_START),
    switchMap((signupAction: SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email,
            resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        }),
      )
    })
  );

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
          return handleAuthentication(+resData.expiresIn, resData.email,
            resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
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
    ofType(AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
    );

  constructor(private actions$: Actions,
    private http: HttpClient,
    private router: Router) {}
}
