import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
const AUTH_PORT = "30001"
const AUTH_API = 'https://192.168.49.2:'+AUTH_PORT+'/api/v1/access/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }),
  observe: 'response' as 'response'
};

const opts: any = {
  headers: new HttpHeaders({
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
  responseType: 'text'
};

@Injectable({
  providedIn: 'root'
})
/*
 * Servizio utilizzato per mandare richieste al back-end per i seguenti servizi:
 *
 * REGISTRAZIONE
 *
 * LOGIN
 */
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      email: email,
      password: password
    }, httpOptions);
  }

  register(nickname: string, email: string, password: string): Observable<any> {
    return this.http.post<string>(AUTH_API + 'register', {
      nickname: nickname,
      email: email,
      password: password
    }, opts);
  }


  loginSocial(nickname: string, email: string, token: string): Observable<any> {
    return this.http.post<string>(AUTH_API + 'loginsocial', {
      nickname: nickname,
      email: email,
      password: token
    }, httpOptions);
  }

  refreshToken(token: string) {
    return this.http.post(AUTH_API + 'refresh', {
      refreshToken: token
    }, httpOptions);
  }
}
