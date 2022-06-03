import { Component, OnInit } from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {UpgradeRequest} from "../../_models/UpgradeRequest";
import * as utility from "../../_shared/functions";

@Component({
  selector: 'app-own-upgrades',
  templateUrl: './own-upgrades.component.html',
  styleUrls: ['./own-upgrades.component.css']
})
export class OwnUpgradesComponent implements OnInit {

  userId: string | undefined;
  listRequest: UpgradeRequest[] = [];
  errorMessage: string = "";

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == null){
      window.location.replace("/login");
      return;
    }
    if(this.tokenStorageService.getUser().creator != null){
      window.location.replace("/profile");
      return;
    }
  }

  ngOnInit(): void {
    if(this.userId == null)return;
    this.userService.getListUpgradeRequest(this.userId).subscribe({
      next: (listRequest: UpgradeRequest[]) => {
        listRequest.forEach( (request: UpgradeRequest) => {
          this.listRequest.push(request);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

}
