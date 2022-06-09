import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PublicUser} from "../../_models/PublicUser";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {Post} from "../../_models/Post";
import {Artwork} from "../../_models/Artwork";
import {Event} from "../../_models/Event"
import {CollaborationRequest} from "../../_models/CollaborationRequest";

const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";
const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/";
const API_GATEWAY_INTERACTIONS = environment.apiGatewayUrl + "api/v1/interactions/";

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor(private http: HttpClient) {
  }

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

  public getArtworks(idCreator: string): Observable<any> {
    return this.http.get<Artwork[]>(API_GATEWAY_PUBLICATIONS + "-/artworks/creator/" + idCreator);
  }

  public getEvents(idCreator: string): Observable<any> {
    return this.http.get<Event[]>(API_GATEWAY_PUBLICATIONS + "-/events/creator/" + idCreator);
  }

  getLikesList(listPublications: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_INTERACTIONS + "-/likes/ids", listPublications);
  }

  getCommentsList(listPublications: string[]): Observable<any> {
    return this.http.post(API_GATEWAY_INTERACTIONS + "-/comments/ids", listPublications);
  }

  getSentRequestCollaboration(idCreator: string): Observable<any> {
    return this.http.get<CollaborationRequest[]>(API_GATEWAY_INTERACTIONS + "collabs/requests/sender/" + idCreator);
  }

  getReceivedRequestCollaboration(idCreator: string): Observable<any> {
    return this.http.get<CollaborationRequest[]>(API_GATEWAY_INTERACTIONS + "collabs/requests/receiver/" + idCreator);
  }

  getSentBroadcastRequest(idCreator: string): Observable<any> {
    return this.http.get<CollaborationRequest[]>(API_GATEWAY_INTERACTIONS + "collabs/requests/broadcast/" + idCreator);
  }

  getBroadcastRequest(): Observable<any> {
    return this.http.get<CollaborationRequest[]>(API_GATEWAY_INTERACTIONS + "collabs/requests/broadcast");
  }

  getListofUser(userIDs: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_USERS + "-/public", userIDs);
  }

  addCollabRequest(collabRequest: CollaborationRequest): Observable<any> {
    return this.http.post<CollaborationRequest>(API_GATEWAY_INTERACTIONS + "collabs/request", collabRequest);
  }

  getFollowed(idCreator: string): Observable<any> {
    return this.http.get<PublicUser[]>(API_GATEWAY_USERS + idCreator + "/followed");
  }

  rejectRequest(idCollaboration: string): Observable<any> {
    return this.http.get(API_GATEWAY_INTERACTIONS + "collabs/request/close/" + idCollaboration);
  }
}
