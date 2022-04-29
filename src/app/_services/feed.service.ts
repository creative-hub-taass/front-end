import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + 'api/v1/publications/';
const API_GATEWAY_INTERACTIONS = environment.apiGatewayUrl + 'api/v1/interactions/';
const API_GATEWAY_USERS = environment.apiGatewayUrl + 'api/v1/users/';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) {
  }

  getPublicFeed(limit: number): Observable<any> {
    if (limit == 0) return this.http.get(API_GATEWAY_PUBLICATIONS + '-/feed');

    return this.http.get(API_GATEWAY_PUBLICATIONS + '-/feed?limit=' + limit);
  }

  getUserFeed(userID: string, limit: number): Observable<any> {
    if (limit == 0) return this.http.get(API_GATEWAY_PUBLICATIONS + 'feed/' + userID);

    return this.http.get(API_GATEWAY_PUBLICATIONS + 'feed/' + userID + '?limit=' + limit);
  }

  getLikesList(listPublications: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_INTERACTIONS + '-/likes/ids', listPublications);
  }

  getCommentsList(listPublications: string[]): Observable<any> {
    return this.http.post(API_GATEWAY_INTERACTIONS + '-/comments/ids', listPublications);
  }

  getListofUser(userIDs: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_USERS + '-/public', userIDs);
  }
}
