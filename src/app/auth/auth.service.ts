import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators'
import { User } from "./user.model";

export interface AuthResponseData{
  idToken: string,
  email: string,
  refresh_token: string,
  id_token: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService{
  user = new Subject<User>();

  constructor(private http: HttpClient){}

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCf3mVU1uV0zk2RrW5NyPgQHSQrHWRC7u4',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
  ).pipe(catchError(this.handlerError),tap(
      respData => {
        this.handlerAuthentication(respData.email, respData.localId,respData.idToken,
           +respData.expiresIn)
      }
    ));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCf3mVU1uV0zk2RrW5NyPgQHSQrHWRC7u4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handlerError),tap(
      respData => {
        this.handlerAuthentication(respData.email, respData.localId,respData.idToken,
           +respData.expiresIn)
      }
    ));
  }

  private handlerError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch(errorRes.error.error.message){
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
      return throwError(errorMessage);

  }

  private handlerAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date().getTime() + expiresIn * 10000;
        const user = new User(
          email, userId,
          token, expirationDate
          );
          this.user.next(user);
  }

}
