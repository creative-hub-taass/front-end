import { Component, OnInit } from '@angular/core';
import {Donation} from "../../_models/Donation";
import {PublicUser} from "../../_models/PublicUser";
import {TokenStorageService} from "../_services/token-storage.service";
import {EventBusService} from "../../_shared/event-bus.service";
import * as utility from "../../_shared/functions";
import {PaymentService} from "../_services/payment.service";
import {User} from "../../_models/User";
import {Creator} from "../../_models/Creator";
import {UserService} from "../_services/user.service";
@Component({
  selector: 'app-own-donations',
  templateUrl: './own-donations.component.html',
  styleUrls: ['./own-donations.component.css']
})
export class OwnDonationsComponent implements OnInit {
  user!: User;
  creator!: Creator;
  userId: string | undefined;
  errorMessage: string = "";
  listDonations: Donation[] = [];
  listCreator: PublicUser[] = [];

  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService,
    private paymentService: PaymentService){
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == undefined){
      window.location.replace("/login");
      return;
    }
    this.userService.getInfoUser(this.userId).subscribe({
      next: (userInfo: User) => {
        this.user = userInfo;
        if(userInfo.creator != null) this.creator = userInfo.creator;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  ngOnInit(): void {
    if(this.userId == undefined)return;
    this.paymentService.getDonations(this.userId).subscribe({
      next: (listDonations: Donation[]) => {
        listDonations.forEach((donation: Donation) => {
          this.listDonations.push(donation);
          this.paymentService.getCreator(donation.idCreator).subscribe({
            next: (creator: PublicUser) => {
              this.listCreator.push(creator);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getCreatorByDonation(idCreator: string): string {
    let index = this.listCreator.findIndex((creator) => {
      return creator.id == idCreator;
    });
    if(index == -1)return "";
    return this.listCreator[index].nickname;
  }
}
