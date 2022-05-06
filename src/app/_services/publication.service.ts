import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/";
const API_GATEWAY_INTERACTIONS = environment.apiGatewayUrl + "api/v1/interactions/";
const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";

@Injectable({
  providedIn: "root"
})
export class PublicationService {


  constructor(
    private http: HttpClient
  ) { }

  public getArtwork(idPublication: string): Observable<any> {
    return this.http.get(API_GATEWAY_PUBLICATIONS + "-/artworks/" + idPublication);
  }

  public getEvent(idPublication: string): Observable<any> {
    return this.http.get(API_GATEWAY_PUBLICATIONS + "-/events/" + idPublication);
  }

  public getPost(idPublication: string): Observable<any> {
    return this.http.get(API_GATEWAY_PUBLICATIONS + "-/posts/" + idPublication);
  }

  public getLikes(idPublication: string): Observable<any> {
    return this.http.get<any[]>(API_GATEWAY_INTERACTIONS + "-/likes/count/" + idPublication);
  }

  public getComments(idPublication: string): Observable<any> {
    return this.http.get(API_GATEWAY_INTERACTIONS + "-/comments/" + idPublication);
  }

  public getUser(userId: string): Observable<any> {
    return this.http.get<any[]>(API_GATEWAY_USERS + "-/" + userId);
  }

  getListofUser(userIDs: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_USERS + "-/public", userIDs);
  }
}
