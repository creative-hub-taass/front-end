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

  listUsers: PublicUser[] = [];
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
          if(index == -1){
            this.listSent.push(elementCollaboration);
            tmpListIds.push(elementCollaboration.id);
          }
        });
        this.callServiceUsers(tmpListIds);
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
          if(index == -1){
            this.listSent.push(elementCollaboration);
            tmpListIds.push(elementCollaboration.id);
          }
        });
        this.callServiceUsers(tmpListIds);
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
            tmpListIds.push(elementCollaboration.id);
          }
        });
        this.callServiceUsers(tmpListIds);
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
            tmpListIds.push(elementCollaboration.id);
          }
        });
        this.callServiceUsers(tmpListIds);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  callServiceUsers(listIds: string[]): void {
    this.creatorService.getListofUser(listIds).subscribe({
      next: (listUsers: PublicUser[]) => {
        console.log(listUsers);
        let index;
        listUsers.forEach((elementUser: PublicUser) => {
          index = this.listUsers.findIndex((element) => {
            return element.id == elementUser.id;
          });
          if(index == -1)this.listUsers.push(elementUser);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getUser(id: string): string {
    let index = this.listUsers.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    return this.listUsers[index].nickname;
  }
}
