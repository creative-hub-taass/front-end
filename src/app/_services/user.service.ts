import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
const API_PORT = "30000"
const API_URL = 'https://192.168.49.2:'+API_PORT+'/api/v1/auth/';


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
    return this.http.get(API_URL + 'users/', opts);
  }

}
