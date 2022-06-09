import {Component} from "@angular/core";
import {UpgradeRequest} from "../../_models/UpgradeRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_services/user.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {CreatorType, getListCreatorType} from "../../_models/Enum";

@Component({
  selector: "app-request-upgrade",
  templateUrl: "./request-upgrade.component.html",
  styleUrls: ["./request-upgrade.component.css", "../modify-artwork/modify-artwork.component.css"]
})
export class RequestUpgradeComponent {

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
    creatorType: CreatorType
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
    creatorType: CreatorType.ARTIST
  };

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    public route: ActivatedRoute
  ) {
    this.userId = this.tokenStorageService.getUser().id;
    if (this.userId == null) {
      window.location.replace("/login");
      return;
    }
    if (this.tokenStorageService.getUser().creator != null) {
      window.location.replace("/profile");
      return;
    }
  }

  onSubmit() {
    if (this.userId == null) return;
    this.buildRequest();
    this.userService.addUpgradeRequest(this.upgradeRequestResult).subscribe({
      next: (upgradeRequest: UpgradeRequest) => {
        console.log(upgradeRequest);
        this.submitted = true;
        window.location.replace("/upgrade-requests");
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
    this.form.creatorType = CreatorType.ARTIST;
  }

  buildRequest() {
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
    };
    this.upgradeRequestResult = new UpgradeRequest(tmp);
  }

  getCreatorType(): CreatorType[] {
    return getListCreatorType();
  }
}
