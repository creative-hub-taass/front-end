import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PublicUser} from "../../_models/PublicUser";
import {Artwork} from "../../_models/Artwork";
import {Event} from "../../_models/Event"
import {Creation} from "../../_models/Publication";
import {Post} from "../../_models/Post";


const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/";
const API_GATEWAY_INTERACTIONS = environment.apiGatewayUrl + "api/v1/interactions/";
const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";

@Injectable({
  providedIn: "root"
})
export class PublicationService {


  constructor(
    private http: HttpClient
  ) {
  }

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

  public getListofUser(userIDs: string[]): Observable<any> {
    return this.http.post<any[]>(API_GATEWAY_USERS + "-/public", userIDs);
  }


  public getListFollower(userID: string): Observable<any> {
    return this.http.get<PublicUser[]>(API_GATEWAY_USERS + userID + "/followers");
  }

  public updateArtwork(artwork: Artwork): void {
    this.http.put(API_GATEWAY_PUBLICATIONS + "artworks/" + artwork.id, artwork);
  }

  public saveArtwork(artwork: Artwork): Observable<any> {
    return this.http.post<Artwork>(API_GATEWAY_PUBLICATIONS + "artworks/", artwork);
  }

  public saveArtworkCreation(artworkCreation: Creation): Observable<any> {
    return this.http.post<any>(API_GATEWAY_PUBLICATIONS + "artworks/creations/", artworkCreation);
  }

  public deleteArtworkCreation(idCreation: string): void {
    this.http.delete(API_GATEWAY_PUBLICATIONS + "artworks/creations/" + idCreation);
  }

  public updateEvent(event: Event): Observable<any> {
    return this.http.put(API_GATEWAY_PUBLICATIONS + "events/" + event.id, event);
  }

  public saveEvent(event: Event): Observable<any> {
    return this.http.post<Event>(API_GATEWAY_PUBLICATIONS + "events/", event);
  }

  public saveEventCreation(eventCreation: Creation): Observable<any> {
    return this.http.post<any>(API_GATEWAY_PUBLICATIONS + "events/creations/", eventCreation);
  }

  public deleteEventCreation(idCreation: string): void {
    this.http.delete(API_GATEWAY_PUBLICATIONS + "events/creations/" + idCreation);
  }

  public savePost(post: Post): Observable<any> {
    return this.http.post<Post>(API_GATEWAY_PUBLICATIONS + "posts/", post);
  }

  public updatePost(post: Post): Observable<any> {
    return this.http.put<Post>(API_GATEWAY_PUBLICATIONS + "posts/" + post.id, post);
  }

  public savePostCreation(postCreation: Creation): Observable<any> {
    return this.http.post<any>(API_GATEWAY_PUBLICATIONS + "posts/creations/", postCreation);
  }

  public deletePostCreation(idCreation: string): void {
   this.http.delete(API_GATEWAY_PUBLICATIONS + "/posts/creations/" + idCreation);
  }
}
