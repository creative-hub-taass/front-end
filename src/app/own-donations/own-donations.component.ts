import { Component, OnInit } from '@angular/core';
import {Donation} from "../../_models/Donation";
import {PublicUser} from "../../_models/PublicUser";
import {TokenStorageService} from "../_services/token-storage.service";
import {EventBusService} from "../../_shared/event-bus.service";
import {UserService} from "../_services/user.service";
import * as utility from "../../_shared/functions";
@Component({
  selector: 'app-own-donations',
  templateUrl: './own-donations.component.html',
  styleUrls: ['./own-donations.component.css']
})
export class OwnDonationsComponent implements OnInit {

  userId: string | undefined;
  errorMessage: string = "";
  listDonations: Donation[] = [];
  listCreator: PublicUser[] = [];

  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService,
    private userService: UserService){
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == undefined){
      window.location.replace("/login");
      return;
    }
  }

  ngOnInit(): void {
    if(this.userId == undefined)return;
    this.userService.getDonations(this.userId).subscribe({
      next: (listDonations: Donation[]) => {
        listDonations.forEach((donation: Donation) => {
          this.listDonations.push(donation);
          this.userService.getCreator(donation.idCreator).subscribe({
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
