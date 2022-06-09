import {Component, OnInit} from "@angular/core";
import {CollaborationRequest} from "../../_models/CollaborationRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {CreatorService} from "../_services/creator.service";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {CollaborationRequestStatus} from "../../_models/Enum";

@Component({
  selector: "app-request-collab",
  templateUrl: "./request-collab.component.html",
  styleUrls: ["./request-collab.component.css", "../modify-artwork/modify-artwork.component.css"]
})
export class RequestCollabComponent implements OnInit {

  creatorId: string | null;
  collabRequestResult!: CollaborationRequest;
  listFollowers: PublicUser[] = [];
  errorMessage: string = "";
  submitted: boolean = false;
  listNickname: string[] = [];

  form: {
    title: string,
    description: string,
    nickname: string,
    contact: string,
    category: string
  } = {
    title: "",
    description: "",
    nickname: "",
    contact: "",
    category: ""
  };

  constructor(
    private eventBusService: EventBusService,
    private tokenStorageService: TokenStorageService,
    private creatorService: CreatorService,
    public route: ActivatedRoute
  ) {
    this.creatorId = this.tokenStorageService.getUser().id;
    if (this.creatorId == null) {
      window.location.replace("/login");
      return;
    }
    if (this.tokenStorageService.getUser().creator == null) {
      window.location.replace("/upgrade-request");
      return;
    }
  }

  ngOnInit(): void {
    if (this.creatorId == null) return;
    this.creatorService.getFollowed(this.creatorId).subscribe({
      next: (listFollowed: PublicUser[]) => {
        this.listNickname.push("");
        listFollowed.forEach((elementFollowed: PublicUser) => {
          this.listFollowers.push(elementFollowed);
          this.listNickname.push(elementFollowed.nickname);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  onSubmit() {
    if (this.creatorId == null) return;
    this.buildRequest();
    if (this.collabRequestResult.receiverId == "") {
      this.collabRequestResult.receiverId = this.creatorId;
    }
    this.creatorService.addCollabRequest(this.collabRequestResult).subscribe({
      next: (collabRequest: CollaborationRequest) => {
        console.log(collabRequest);
        this.submitted = true;
        window.location.replace("/collaborations-requests");
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  resetForm() {
    this.form.title = "";
    this.form.description = "";
    this.form.nickname = "";
    this.form.contact = "";
    this.form.category = "";
  }

  buildRequest() {
    let tmp: CollaborationRequest;
    if (this.creatorId == null) return;
    if (this.form.nickname != "") {
      tmp = {
        id: "",
        senderId: this.creatorId,
        receiverId: this.getUserId(this.form.nickname),
        title: this.form.title,
        description: this.form.description,
        timestamp: new Date().toISOString(),
        contact: this.form.contact,
        category: this.form.category,
        status: CollaborationRequestStatus.OPEN
      };
    } else {
      tmp = {
        id: "",
        senderId: this.creatorId,
        receiverId: this.creatorId,
        title: this.form.title,
        description: this.form.description,
        timestamp: new Date().toISOString(),
        contact: this.form.contact,
        category: this.form.category,
        status: CollaborationRequestStatus.OPEN
      };
    }
    this.collabRequestResult = new CollaborationRequest(tmp);
  }

  getUserId(nickname: string): string {
    let index = this.listFollowers.findIndex((elementFollowed) => {
      return elementFollowed.nickname == nickname;
    });
    return this.listFollowers[index].id;
  }

}
