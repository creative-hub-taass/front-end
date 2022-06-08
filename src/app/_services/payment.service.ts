import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../../_models/Order";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Donation} from "../../_models/Donation";
import {Artwork} from "../../_models/Artwork";
import {PublicUser} from "../../_models/PublicUser";

const API_GATEWAY_PAYMENTS = environment.apiGatewayUrl + "api/v1/payments/";
const API_GATEWAY_PUBLICATIONS = environment.apiGatewayUrl + "api/v1/publications/";
const API_GATEWAY_USERS = environment.apiGatewayUrl + "api/v1/users/";

const httpOptions: any = {
  headers: new HttpHeaders({"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}),
  responseType: "text/plain;charset=UTF-8"
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  buyArtwork(order: Order): Observable<any> {
    return this.http.post<string>(API_GATEWAY_PAYMENTS + "buyartwork", order, httpOptions);
  }

  sendTip(donation: Donation): Observable<any> {
    return this.http.post(API_GATEWAY_PAYMENTS + "donation", donation, httpOptions )
  }

  getDonations(idUser: string): Observable<any> {
    return this.http.get<Donation[]>(API_GATEWAY_PAYMENTS + "donations/" + idUser);
  }

  getOrders(idUser: string): Observable<any> {
    return this.http.get<Order[]>(API_GATEWAY_PAYMENTS + "orders/" + idUser);
  }

  getArtwork(idArtwork: string): Observable<any> {
    return this.http.get<Artwork>(API_GATEWAY_PUBLICATIONS + "-/artworks/" + idArtwork);
  }

  getCreator(creatorId: string): Observable<any> {
    return this.http.get<PublicUser>(API_GATEWAY_USERS + "-/" + creatorId);
  }

}
