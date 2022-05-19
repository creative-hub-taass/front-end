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
  submitted: boolean = false;

  form: {
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
  } = {
    name: "",
    surname: "",
    bio: "",
    portfolio: "",
    motivationalText: "",
    artName: "",
    birthDate: "",
    username: "",
    avatar: "",
    paymentEmail: "",
    creatorType: ""
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
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.userId == null)return;
    this.buildRequest();
    this.userService.addUpgradeRequest(this.upgradeRequestResult).subscribe({
      next: (upgradeRequest: UpgradeRequest) => {
        console.log(upgradeRequest);
        this.submitted = true;
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
    let tmp: any = {
      id: "",
      user: new PublicUser(this.tokenStorageService.getUser()),
      name: this.form.name,
      surname: this.form.surname,
      bio: this.form.bio,
      portfolio: this.form.portfolio,
      motivationalText: this.form.motivationalText,
      artName: this.form.artName,
      birthDate: this.form.birthDate,
      username: this.form.username,
      avatar: this.form.avatar,
      paymentEmail: this.form.paymentEmail,
      status: "OPEN",
      creatorType: this.form.creatorType
    }
    this.upgradeRequestResult = new UpgradeRequest(tmp);
  }

  getCreatorType(): string[] {
    return getListCreatorType();
  }
}
