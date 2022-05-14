import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PublicUser} from "../../_models/PublicUser";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {Post} from "../../_models/Post";

const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";
const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/";
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

  public getPublications(idCreator: string): Observable<any> {
    return this.http.get<PublicationInfo[]>(API_GATEWAY_PUBLICATIONS + "creator/" + idCreator);
  }

  public getPosts(idCreator: string): Observable<any> {
    return this.http.get<Post[]>(API_GATEWAY_PUBLICATIONS + "-/posts/creator/" + idCreator);
  }
}
