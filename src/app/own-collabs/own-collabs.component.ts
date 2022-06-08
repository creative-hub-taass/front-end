import { Component, OnInit } from '@angular/core';
import {CollaborationRequest} from "../../_models/CollaborationRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import {CreatorService} from "../_services/creator.service";
import * as utility from "../../_shared/functions";
import {PublicUser} from "../../_models/PublicUser";

@Component({
  selector: 'app-own-collabs',
  templateUrl: './own-collabs.component.html',
  styleUrls: ['./own-collabs.component.css']
})
export class OwnCollabsComponent implements OnInit {

  listUsersSent: PublicUser[] = [];
  listUsersReceived: PublicUser[] = [];
  listUsersBroadcast: PublicUser[] = [];
  listUsersSentBroadcast: PublicUser[] = [];
  listSent: CollaborationRequest[] = [];
  listReceived: CollaborationRequest[] = [];
  listBroadcast: CollaborationRequest[] = [];
  creatorId: string | null;
  errorMessage: string = "";

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.creatorId = this.tokenStorageService.getUser().id;
    if(this.creatorId == null) {
      window.location.replace("/login");
      return;
    }
    if(this.tokenStorageService.getUser().creator == null){
      window.location.replace("/upgrade-request");
      return;
    }
  }

  ngOnInit(): void {
    if(this.creatorId == null)return;
    let index;
    this.creatorService.getSentRequestCollaboration(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if(index == -1 && this.creatorId != elementCollaboration.receiverId){
              this.listSent.push(elementCollaboration);
              tmpListIds.push(elementCollaboration.receiverId);
          }
        });
        this.callServiceUsers(tmpListIds, this.listUsersSent);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.creatorService.getSentBroadcastRequest(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if(index == -1 && elementCollaboration.receiverId != this.creatorId){
            this.listSent.push(elementCollaboration);
            tmpListIds.push(elementCollaboration.senderId);
          }
        });
        this.callServiceUsers(tmpListIds, this.listUsersSentBroadcast);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.creatorService.getReceivedRequestCollaboration(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listReceived.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if(index == -1 && elementCollaboration.senderId != this.creatorId){
            this.listReceived.push(elementCollaboration);
            tmpListIds.push(elementCollaboration.senderId);
          }
        });
        this.callServiceUsers(tmpListIds, this.listUsersReceived);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.creatorService.getBroadcastRequest().subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listBroadcast.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if(index == -1){
            this.listBroadcast.push(elementCollaboration);
            tmpListIds.push(elementCollaboration.senderId);
          }
        });
        this.callServiceUsers(tmpListIds, this.listUsersBroadcast);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  callServiceUsers(listIds: string[], listOutput: PublicUser[]): void {
    this.creatorService.getListofUser(listIds).subscribe({
      next: (listUsers: PublicUser[]) => {
        let index;
        listUsers.forEach((elementUser: PublicUser) => {
          index = listOutput.findIndex((element) => {
            return element.id == elementUser.id;
          });
          if(index == -1)listOutput.push(elementUser);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getUser(id: string): string {
    if(id == null)return "";
    let index = this.listUsersSent.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if(index != -1) {
      return this.listUsersSent[index].nickname;
    }

    index = this.listUsersSentBroadcast.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if(index != -1) {
      return this.listUsersSentBroadcast[index].nickname;
    }

    index = this.listUsersBroadcast.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if(index != -1) {
      return this.listUsersBroadcast[index].nickname;
    }

    index = this.listUsersReceived.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if(index != -1) {
      return this.listUsersReceived[index].nickname;
    }

    return "";
  }
}
