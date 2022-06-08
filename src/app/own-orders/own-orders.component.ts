import { Component, OnInit } from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {Artwork} from "../../_models/Artwork";
import * as utility from "../../_shared/functions";
import {PaymentService} from "../_services/payment.service";

@Component({
  selector: 'app-own-orders',
  templateUrl: './own-orders.component.html',
  styleUrls: ['./own-orders.component.css']
})
export class OwnOrdersComponent implements OnInit {

  userId: string | undefined;
  listOrders: any[] = [];
  errorMessage: string = "";
  listArtwork: Artwork[] = [];

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private paymentService: PaymentService
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == undefined){
      window.location.replace("/login");
      return;
    }
  }

  ngOnInit(): void {
    if(this.userId == undefined)return;
    this.paymentService.getOrders(this.userId).subscribe({
      next: (listOrders) => {
        listOrders.forEach((order: any) => {
          this.listOrders.push(order);
          console.log(order.timestamp);
          this.paymentService.getArtwork(order.idArtwork).subscribe({
            next: (artwork: Artwork) => {
              this.listArtwork.push(artwork);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
        console.log(this.listOrders);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getArtworkByOrder(idArtwork: string): string {
    let index = this.listArtwork.findIndex((artwork: Artwork) => {
      return artwork.id == idArtwork;
    });
    if(index == -1) return "";
    return this.listArtwork[index].name;
  }

}
