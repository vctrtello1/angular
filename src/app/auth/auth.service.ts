import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from 'rxjs/operators'

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


  constructor(private http: HttpClient){}

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCf3mVU1uV0zk2RrW5NyPgQHSQrHWRC7u4',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handlerError));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCf3mVU1uV0zk2RrW5NyPgQHSQrHWRC7u4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      );
  }

  private handlerError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'The email already exists.';
      }
      return throwError(errorMessage);

  }

}
