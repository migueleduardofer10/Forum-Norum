import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/singup-request.payload';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) {
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    console.log(signupRequestPayload)
    return this.httpClient.post('http://localhost:3000/users', signupRequestPayload);
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<any> {
    return this.httpClient.get('http://localhost:3000/users?username=' + loginRequestPayload.username + '&password=' + loginRequestPayload.password)
      //establecer el username en el localstorage
      .pipe(map(data => {
        if (data[0]) {
          this.localStorage.store('username', loginRequestPayload.username);
          //recuperar el username del localstorage
          this.username.emit(this.getUserName());
          this.loggedIn.emit(true);
          this.username.emit(loginRequestPayload.username);
        }
        return data;
      }));
      }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  logout() {
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  //Función que comprueba si está logeado 
  isLoggedIn(): boolean {
    return this.localStorage.retrieve('username');
  }
  

  //Obtener el usuario dando un usuario y password y guardar sus datos en el local storage 
  //para poder usarlos en otras partes de la app
 
  }


