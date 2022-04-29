import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const PATH = '/api/v1/publications';
const API_GATEWAY_URL = environment.apiGatewayUrl + PATH;

const opts: any = {
  headers: new HttpHeaders({
    'Accept': '*/*',
    'Access-Control-Allow-Origin': '*'
  }),
  responseType: 'application/json'
};

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) { }

  getPublicFeed(limit: number): Observable<any> {
    if(limit==0) return this.http.get(API_GATEWAY_URL + '/-/feed' , opts);

    return this.http.get(API_GATEWAY_URL + '/-/feed?limit=' + limit);
  }

  getUserFeed(userID: string, limit: number): Observable<any> {
    if(limit==0) return this.http.get(API_GATEWAY_URL + '/feed/' + userID, opts);

    return this.http.get(API_GATEWAY_URL + '/feed/' + userID + '?limit=' + limit);
  }

  getLikesList(listPublications: string[]): Observable<any> {
    return this.http.post(API_GATEWAY_URL + 'path/interactions/likes', {
      listPublicationsID: listPublications
    }, opts);
  }

  getCommentsList(listPublications: string[]): Observable<any> {
    return this.http.post(API_GATEWAY_URL + 'path/interactions/comments', {
      listPublicationsID: listPublications
    }, opts);
  }
}
