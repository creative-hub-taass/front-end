import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UpgradeRequest} from "../../_models/UpgradeRequest";
import {PublicUser} from "../../_models/PublicUser";
import {User} from "../../_models/User";
import {Donation} from "../../_models/Donation";
import {Order} from "../../_models/Order";
import {Artwork} from "../../_models/Artwork";


const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";
const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/"
@Injectable({
  providedIn: "root"
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getInfoUser(userId: string): Observable<any> {
    return this.http.get<User>(API_GATEWAY_USERS + userId);
  }

  getCreator(creatorId: string): Observable<any> {
    return this.http.get<PublicUser>(API_GATEWAY_USERS + "-/" + creatorId);
  }

  addUpgradeRequest(upgradeRequest: UpgradeRequest): Observable<any> {
    return this.http.post<UpgradeRequest>(API_GATEWAY_USERS + "upgrade/request", upgradeRequest);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put<User>(API_GATEWAY_USERS + user.id, user);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(API_GATEWAY_USERS + userId + "/changepassword?oldPassword=" + oldPassword + "&newPassword=" + newPassword, null);
  }

  getRequestOfUser(idUser: string): Observable<any> {
    return this.http.get<UpgradeRequest[]>(API_GATEWAY_USERS + "upgrade/request/user/" + idUser);
  }

  getDonations(idUser: string): Observable<any> {
    return this.http.get<Donation[]>(API_GATEWAY_USERS + "donations/" + idUser);
  }

  getOrders(idUser: string): Observable<any> {
    return this.http.get<Order[]>(API_GATEWAY_USERS + "orders/" + idUser);
  }

  getArtwork(idArtwork: string): Observable<any> {
    return this.http.get<Artwork>(API_GATEWAY_PUBLICATIONS + "-/artworks/" + idArtwork);
  }
}
