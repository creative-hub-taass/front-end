import { Component, OnInit } from '@angular/core';
import {CollaborationRequest} from "../../_models/CollaborationRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {CreatorService} from "../_services/creator.service";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {getListCategory} from "../../_models/Enum";

@Component({
  selector: 'app-request-collab',
  templateUrl: './request-collab.component.html',
  styleUrls: ['./request-collab.component.css']
})
export class RequestCollabComponent implements OnInit {

  creatorId: string | null;
  collabRequestResult!: CollaborationRequest;
  listFollowers: PublicUser[] = []
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
    if(this.creatorId == null){
      this.errorMessage = "Error, you aren't a creator";
      return;
    }
  }

  ngOnInit(): void {
    if(this.creatorId == null)return;
    this.creatorService.getFollowed(this.creatorId).subscribe({
      next: (listFollowed: PublicUser[]) => {
        listFollowed.forEach((elementFollowed: PublicUser) => {
          this.listFollowers.push(elementFollowed);
          this.listNickname.push(elementFollowed.nickname);
        });
        console.log(listFollowed);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  onSubmit() {
    if(this.creatorId == null)return;
    this.buildRequest();
    this.creatorService.addCollabRequest(this.collabRequestResult).subscribe({
      next: (collabRequest: CollaborationRequest) => {
        console.log(collabRequest);
        this.submitted = true;
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
    let tmp: any = {
      id: "",
      senderId: this.creatorId,
      receiverId: this.getUserId(this.form.nickname),
      title: this.form.title,
      description: this.form.description,
      timestamp: new Date().toISOString(),
      contact: this.form.contact,
      category: this.form.category,
      status: "OPEN"
    };
    this.collabRequestResult = new CollaborationRequest(tmp);
  }

  getUserId(nickname: string): string {
    let index = this.listFollowers.findIndex((elementFollowed) => {
      return elementFollowed.nickname == nickname;
    });
    return this.listFollowers[index].id;
  }

  getCategory(): string[] {
    return getListCategory();
  }
}