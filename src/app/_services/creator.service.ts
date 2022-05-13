import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PublicUser} from "../../_models/PublicUser";

const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor(private http: HttpClient) { }

  public getCreator(idCreator: string): Observable<any> {
    return this.http.get<PublicUser>(API_GATEWAY_USERS + "-/" + idCreator);
  }

  public setFollower(idFollower: string, idFollowed: string): Observable<any> {
    return this.http.put<PublicUser>(API_GATEWAY_USERS + idFollower + "/follow/" + idFollowed, null);
  }

  public deleteFollower(idFollower: string, idFollowed: string): Observable<any> {
    return this.http.put<PublicUser>(API_GATEWAY_USERS + idFollower + "/unfollow/" + idFollowed, null);
  }
}
