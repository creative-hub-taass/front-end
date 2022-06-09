import {Component, OnInit} from "@angular/core";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {Artwork} from "../../_models/Artwork";
import * as utility from "../../_shared/functions";
import {PaymentService} from "../_services/payment.service";
import {User} from "../../_models/User";
import {UserService} from "../_services/user.service";
import {Creator} from "../../_models/Creator";

@Component({
  selector: "app-own-orders",
  templateUrl: "./own-orders.component.html",
  styleUrls: ["./own-orders.component.css"]
})
export class OwnOrdersComponent implements OnInit {
  user!: User;
  creator!: Creator;
  userId: string | undefined;
  listOrders: any[] = [];
  errorMessage: string = "";
  listArtwork: Artwork[] = [];

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private paymentService: PaymentService,
    private userService: UserService
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if (this.userId == undefined) {
      window.location.replace("/login");
      return;
    }
    this.userService.getInfoUser(this.userId).subscribe({
      next: (userInfo: User) => {
        this.user = userInfo;
        if (userInfo.creator != null) this.creator = userInfo.creator;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  ngOnInit(): void {
    if (this.userId == undefined) return;
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
    if (index == -1) return "";
    return this.listArtwork[index].name;
  }

}
