import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
const API_PORT = "30001"
const API_URL = 'http://192.168.49.2:'+API_PORT+'/api/v1/';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'users', {responseType: 'json'});
  }

}
