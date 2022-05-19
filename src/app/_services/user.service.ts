import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UpgradeRequest} from "../../_models/UpgradeRequest";


const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";

const opts: any = {
  headers: new HttpHeaders({
    "Accept": "*/*",
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  }),
  responseType: "application/json"
};

@Injectable({
  providedIn: "root"
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_GATEWAY_USERS, opts);
  }

  addUpgradeRequest(upgradeRequest: UpgradeRequest): Observable<any> {
    return this.http.post<UpgradeRequest>(API_GATEWAY_USERS + "upgrade/request", upgradeRequest);
  }

}
