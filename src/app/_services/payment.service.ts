import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../../_models/Order";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Donation} from "../../_models/Donation";

const API_GATEWAY_PAYMENTS = environment.apiGatewayUrl + "api/v1/payments/";

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

}
