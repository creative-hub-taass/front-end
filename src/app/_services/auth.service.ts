import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

const PATH = 'api/v1/users/-/auth/';
const API_GATEWAY_URL = environment.apiGatewayUrl + PATH;

const httpOptionsLogin = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }),
  observe: 'response' as 'response'
};
const httpOptionsRefresh: any = {
  headers: new HttpHeaders({'Content-Type':'text/plain','Access-Control-Allow-Origin': '*' }),
  responseType: 'text/plain;charset=UTF-8'
}
const httpOptionsRegister: any = {
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
    return this.http.post(API_GATEWAY_URL + 'login', {
      email: email,
      password: password
    }, httpOptionsLogin);
  }

  register(nickname: string, email: string, password: string): Observable<any> {
    return this.http.post<string>(API_GATEWAY_URL + 'register', {
      nickname: nickname,
      email: email,
      password: password
    }, httpOptionsRegister);
  }


  loginSocial(nickname: string, email: string, token: string): Observable<any> {
    return this.http.post<string>(API_GATEWAY_URL + 'loginsocial', {
      nickname: nickname,
      email: email,
      password: token
    }, httpOptionsLogin);
  }

  refreshToken(token: string) {
    return this.http.post(API_GATEWAY_URL + 'refresh', {
      token
    }, httpOptionsRefresh);
  }
}
