import {Component, OnInit} from "@angular/core";
import {UserService} from "../_services/user.service";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import * as utility from "../../_shared/functions";
import {CreatorType, getListCreatorType} from "../../_models/Enum";
import {User} from "../../_models/User";
import {Creator} from "../../_models/Creator";
import {Order} from "../../_models/Order";
import {Donation} from "../../_models/Donation";
import {UpgradeRequest} from "../../_models/UpgradeRequest";
import {Artwork} from "../../_models/Artwork";
import {PublicUser} from "../../_models/PublicUser";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {

  userId: string | null;
  errorMessage: string = "";
  user!: User;
  creator!: Creator;
  submitted: boolean = false;
  errorPassword: string = "";
  submittedPassword: boolean = false;
  popupView: boolean = false;
  modifyView: boolean = true;

  orderView: boolean = false;
  listOrders!: Order[];
  listArtwork!: Artwork[];

  donationView: boolean = false;
  listDonations!: Donation[];
  listCreator!: PublicUser[];

  upgradeView: boolean = false;
  listUpgrade!: UpgradeRequest[];

  form: {
    username: string,
    nickname: string,
    email: string,
    name: string,
    surname: string,
    birthDate: string,
    bio: string,
    creatorType: CreatorType,
    avatar: string,
    paymentEmail: string
  } = {
    username: "",
    nickname: "",
    email: "",
    name: "",
    surname: "",
    birthDate: "",
    bio: "",
    creatorType: CreatorType.ARTIST,
    avatar: "",
    paymentEmail: ""
  };

  formPassword: {
    oldPassword: string,
    newPassword: string,
    newPassword2: string,
  } = {
    oldPassword: "",
    newPassword: "",
    newPassword2: ""
  };

  constructor(private tokenStorageService: TokenStorageService,
              private eventBusService: EventBusService,
              private userService: UserService) {
    this.userId = this.tokenStorageService.getUser().id;
    if(this.userId == null){
      window.location.replace("/login");
      return;
    }
    this.userService.getInfoUser(this.userId).subscribe({
      next: (userInfo: User) => {
        this.user = userInfo;
        if(userInfo.creator != null) this.creator = userInfo.creator;
        this.buildForm();
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  ngOnInit(): void {
  }

  buildForm() {
    this.form.username = this.user.username;
    this.form.nickname = this.user.nickname;
    this.form.email = this.user.email;
    if(this.creator != null){
      this.form.name = this.creator.name;
      this.form.birthDate = this.creator.birthDate;
      this.form.bio = this.creator.bio;
      this.form.creatorType = this.creator.creatorType;
      this.form.avatar = this.creator.avatar;
      this.form.paymentEmail = this.creator.paymentEmail;
    }
  }

  onSubmit() {
    let tmpUser: any;
    if(this.creator != null) {
      tmpUser = {
        id: this.userId,
        username: this.form.username,
        nickname: this.form.nickname,
        email: this.form.email,
        role: this.user.role,
        creator: {
          id: this.creator.id,
          name: this.form.name,
          surname: this.form.surname,
          birthDate: this.form.birthDate,
          bio: this.form.bio,
          creatorType: this.form.creatorType,
          avatar: this.form.avatar,
          paymentEmail: this.form.paymentEmail
        },
        inspirerIds: this.user.inspirerIds,
        fanIds: this.user.fanIds
      };
    } else {
      tmpUser =  {
        id: this.userId,
        username: this.form.username,
        nickname: this.form.nickname,
        email: this.form.email,
        role: this.user.role,
        creator: null,
        inspirerIds: this.user.inspirerIds,
        fanIds: this.user.fanIds
      };
    }
    let user: User = new User(tmpUser);
    this.userService.updateUser(user).subscribe({
      next: (user: User) => {
        this.submitted = true;
        this.tokenStorageService.saveUser(user);
        this.user = user;
        this.creator = user.creator;
        this.buildForm();
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  resetForm() {
    this.buildForm();
  }

  getCreatorType() {
    return getListCreatorType();
  }

  ChangePassword() {
    if(this.formPassword.newPassword != this.formPassword.newPassword2){
      this.errorPassword = "New passwords are not equals";
      return;
    }
    if(this.userId == null)return;
    this.userService.changePassword(this.userId, this.formPassword.oldPassword, this.formPassword.newPassword).subscribe({
      next: () => {
        this.submittedPassword = true;
      },
      error: (error) => {
        this.errorPassword = utility.onError(error, this.eventBusService);
      }
    });
  }

  getOrders() {
    if(this.userId == null)return;
    this.userService.getOrders(this.userId).subscribe({
      next: (listOrders: Order[]) => {
        this.listOrders = new Array<Order>();
        listOrders.forEach((elementOrder: Order) => {
          this.listOrders.push(elementOrder);
          this.userService.getArtwork(elementOrder.idArtwork).subscribe({
            next: (artwork: Artwork) => {
              this.listArtwork = new Array<Artwork>();
              this.listArtwork.push(artwork);
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

  getArtworkByOrder(idArtwork: string): string {
    let index = this.listArtwork.findIndex((elementArtwork) => {
      return elementArtwork.id == idArtwork;
    });
    return this.listArtwork[index].name;
  }

  getDonations() {
    if(this.userId == null)return;
    this.userService.getDonations(this.userId).subscribe({
      next: (listDonations: Donation[]) => {
        this.listDonations = new Array<Donation>();
        this.listCreator = new Array<PublicUser>();
        listDonations.forEach((elementDonation: Donation) => {
          this.listDonations.push(elementDonation);
          this.userService.getCreator(elementDonation.idCreator).subscribe({
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
    let index = this.listCreator.findIndex((elementCreator) => {
      return elementCreator.id == idCreator;
    });
    return this.listCreator[index].nickname;
  }

  getUpgradeRequest() {
    if(this.userId == null)return;
    this.userService.getRequestOfUser(this.userId).subscribe({
      next: (listRequests: UpgradeRequest[]) => {
        this.listUpgrade = new Array<UpgradeRequest>();
        listRequests.forEach((elementRequest: UpgradeRequest) => {
          this.listUpgrade.push(elementRequest);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  setView(option: string) {
    switch (option) {
      case 'order': {
        this.orderView = true;
        this.donationView = false;
        this.upgradeView = false;
        this.modifyView = false;
        this.popupView = false;
        break;
      }
      case 'donation': {
      this.donationView = true;
      this.orderView = false;
      this.upgradeView = false;
      this.modifyView = false;
      this.popupView = false;
      break;
      }
      case 'upgrade': {
        if(this.creator != null)return;
        this.upgradeView = true;
        this.orderView = false;
        this.donationView = false;
        this.modifyView = false;
        this.popupView = false;
        break;
      }
      case 'modify': {
        this.modifyView = true;
        this.orderView = false;
        this.donationView = false;
        this.upgradeView = false;
        this.popupView = false;
        break;
      }
      case 'popup': {
        this.popupView = true;
        this.orderView = false;
        this.donationView = false;
        this.upgradeView = false;
        this.modifyView = false;
        break;
      }
    }
  }
}
