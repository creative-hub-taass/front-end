import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const PATH = '/api/v1/users/';
const API_GATEWAY_URL = environment.apiGatewayUrl + PATH;

const opts: any = {
  headers: new HttpHeaders({
    'Accept': '*/*',
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }),
  responseType: 'application/json'
};

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_GATEWAY_URL , opts);
  }

}
