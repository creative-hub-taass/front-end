import { Component, OnInit } from '@angular/core';
import {UpgradeRequest} from "../../_models/UpgradeRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_services/user.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {getListCreatorType} from "../../_models/Enum";

@Component({
  selector: 'app-request-upgrade',
  templateUrl: './request-upgrade.component.html',
  styleUrls: ['./request-upgrade.component.css']
})
export class RequestUpgradeComponent implements OnInit {

  userId: string | null;
  upgradeRequestResult!: UpgradeRequest;
  errorMessage: string = "";

  form!: {
    name: string,
    surname: string,
    bio: string,
    portfolio: string,
    motivationalText: string,
    artName: string,
    birthDate: string,
    username: string,
    avatar: string,
    paymentEmail: string,
    creatorType: string
  };

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    public route: ActivatedRoute
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == null){
      this.errorMessage = "Error, you aren't logged";
      return;
    }
    this.resetForm();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.userId == null)return;
    this.buildRequest();
    this.userService.addUpgradeRequest(this.upgradeRequestResult).subscribe({
      next: (upgradeRequest: UpgradeRequest) => {
        console.log(upgradeRequest);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  resetForm() {
    this.form.name = "";
    this.form.surname = "";
    this.form.bio = "";
    this.form.portfolio = "";
    this.form.motivationalText = "";
    this.form.artName = "";
    this.form.birthDate = "";
    this.form.username = "";
    this.form.avatar = "";
    this.form.paymentEmail = "";
    this.form.creatorType = "";
  }

  buildRequest(){
    this.upgradeRequestResult.id = "";
    this.upgradeRequestResult.user = new PublicUser(this.tokenStorageService.getUser());
    this.upgradeRequestResult.name = this.form.name;
    this.upgradeRequestResult.surname = this.form.surname;
    this.upgradeRequestResult.bio = this.form.bio;
    this.upgradeRequestResult.portfolio = this.form.bio;
    this.upgradeRequestResult.motivationalText = this.form.motivationalText;
    this.upgradeRequestResult.artName = this.form.artName;
    this.upgradeRequestResult.birthDate = this.form.birthDate;
    this.upgradeRequestResult.username = this.form.username;
    this.upgradeRequestResult.avatar = this.form.avatar;
    this.upgradeRequestResult.paymentEmail = this.form.paymentEmail;
    this.upgradeRequestResult.status = "OPEN";
    this.upgradeRequestResult.creatorType = this.form.creatorType;
  }

  getCreatorType(): string[] {
    return getListCreatorType();
  }
}
