import { Component, OnInit } from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {Order} from "../../_models/Order";
import {Artwork} from "../../_models/Artwork";
import * as utility from "../../_shared/functions";

@Component({
  selector: 'app-own-orders',
  templateUrl: './own-orders.component.html',
  styleUrls: ['./own-orders.component.css']
})
export class OwnOrdersComponent implements OnInit {

  userId: string | undefined;
  listOrders: Order[] = [];
  errorMessage: string = "";
  listArtwork: Artwork[] = [];

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == undefined){
      window.location.replace("/login");
      return;
    }
  }

  ngOnInit(): void {
    if(this.userId == undefined)return;
    this.userService.getOrders(this.userId).subscribe({
      next: (listOrders: Order[]) => {
        listOrders.forEach((order: Order) => {
          this.listOrders.push(order);
          this.userService.getArtwork(order.idArtwork).subscribe({
            next: (artwork: Artwork) => {
              this.listArtwork.push(artwork);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        })
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