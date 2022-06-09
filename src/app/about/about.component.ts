import {Component, OnInit} from "@angular/core";
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {CreatorService} from "../_services/creator.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as utility from "../../_shared/functions";
import {delay} from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";
import {Post} from "../../_models/Post";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {PaymentService} from "../_services/payment.service";
import {Donation} from "../../_models/Donation";
import {Currency, getListCurrency} from "../../_models/Enum";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {

  followed: boolean = false;
  sameId: boolean = false;
  userId!: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string = "";
  listPosts!: Post[];
  listPublicationInfo!: PublicationInfo[];
  wait: boolean = false;

  popup: boolean = false;
  form: { imp: string; currency: Currency; message: string } = {
    imp: "",
    currency: Currency.EUR,
    message: ""
  };

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    private paymentService: PaymentService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    if (this.userId != null) {
      let userStorage: string | null = window.sessionStorage.getItem(this.userId);
      if (userStorage != null) {
        this.user = new PublicUser(JSON.parse(userStorage));
        this.creator = new PublicCreator(this.user.creator);
        this.callServicePublications(utility.callServiceInteractions);
      }
    }
    if (this.tokenStorageService.getUser().id == undefined) return;
    let index = this.tokenStorageService.getUser().inspirerIds.findIndex((idUser: string) => {
      return idUser == this.userId;
    });
    this.followed = (index != -1);
    this.sameId = (this.tokenStorageService.getUser().id == this.userId);
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.errorMessage = "Error";
      return;
    }
    if (this.user != null) return;
    this.creatorService.getCreator(this.userId).subscribe({
      next: (publicUser: PublicUser) => {
        this.user = new PublicUser(publicUser);
        this.creator = new PublicCreator(this.user.creator);
        window.sessionStorage.setItem(publicUser.id, JSON.stringify(this.user));
        this.callServicePublications(utility.callServiceInteractions);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }


  reload() {
    utility.refreshDate(this.userId, this.user,
      this.tokenStorageService,
      this.eventBusService,
      this.creatorService,
      this.errorMessage);

  }

  follow() {
    utility.followCreator(this.tokenStorageService,
      this.creatorService,
      this.eventBusService,
      this.user,
      this.errorMessage);
  }

  unfollow() {
    utility.unfollowCreator(this.tokenStorageService,
      this.creatorService,
      this.eventBusService,
      this.user,
      this.errorMessage);
  }

  callServicePublications(callServiceInteractions: any): void {
    this.creatorService.getPosts(this.user.id).subscribe({
      next: (listPosts: Post[]) => {
        this.listPosts = new Array<Post>();
        let listPublicationsID: string[] = new Array<string>();
        this.listPublicationInfo = new Array<PublicationInfo>();
        listPosts.forEach((elementPost: Post) => {
          this.listPosts.push(elementPost);
          listPublicationsID.push(elementPost.id);
          this.listPublicationInfo.push(new PublicationInfo(elementPost, []));
        });
        callServiceInteractions(listPublicationsID,
          this.creatorService,
          this.listPublicationInfo,
          this.eventBusService,
          this.errorMessage);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getLikesCount(postId: string): number {
    if (this.listPublicationInfo == undefined) return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == postId;
    });
    if (index != -1) return this.listPublicationInfo[index].getLikes();
    return 0;
  }

  getCommentsCount(postId: string): number {
    if (this.listPublicationInfo == undefined) return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == postId;
    });
    if (index != -1) return this.listPublicationInfo[index].getComments().length;
    return 0;
  }

  submitTip() {
    if (this.tokenStorageService.getUser().id == null) {
      window.location.replace("/login");
      return;
    }
    if (this.userId == this.tokenStorageService.getUser().id) {
      this.popup = false;
      return;
    }
    let tmpDonation: any = {
      idSender: this.tokenStorageService.getUser().id,
      idCreator: this.userId,
      importo: this.form.imp,
      message: this.form.message,
      currency: this.form.currency
    };
    this.paymentService.sendTip(new Donation(tmpDonation)).subscribe({
      next: (urlPaypal: string) => {
        if (urlPaypal.includes("redirect", 0)) {
          (async () => {
            this.wait = true;
            await delay(8000);
            this.wait = false;
            window.location.href = encodeURI(urlPaypal.substring(9, urlPaypal.length));
          })();
          return;
        }
        this.router.navigate(["/payment-failed", urlPaypal]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getCurrency(): Currency[] {
    return getListCurrency();
  }

}
