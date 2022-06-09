import {Component, OnInit} from "@angular/core";
import {CollaborationRequest} from "../../_models/CollaborationRequest";
import {EventBusService} from "../../_shared/event-bus.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import {CreatorService} from "../_services/creator.service";
import * as utility from "../../_shared/functions";
import {PublicUser} from "../../_models/PublicUser";
import {UserService} from "../_services/user.service";
import {User} from "../../_models/User";
import {Creator} from "../../_models/Creator";
import {CollaborationRequestStatus} from "../../_models/Enum";

@Component({
  selector: "app-own-collabs",
  templateUrl: "./own-collabs.component.html",
  styleUrls: ["./own-collabs.component.css"]
})
export class OwnCollabsComponent implements OnInit {
  user!: User;
  creator!: Creator;
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
    private userService: UserService,
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
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
    this.userService.getInfoUser(this.creatorId).subscribe({
      next: (userInfo: User) => {
        this.user = userInfo;
        if (userInfo.creator != null) this.creator = userInfo.creator;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  ngOnInit(): void {
    if (this.creatorId == null) return;
    let index;
    this.creatorService.getSentRequestCollaborationOpen(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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

    this.creatorService.getSentRequestCollaborationClosed(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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

    this.creatorService.getSentBroadcastRequestOpen(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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

    this.creatorService.getSentBroadcastRequestClosed(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listSent.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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

    this.creatorService.getReceivedRequestCollaborationOpen(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listReceived.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1 && elementCollaboration.senderId != this.creatorId) {
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

    this.creatorService.getReceivedRequestCollaborationClosed(this.creatorId).subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listReceived.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1 && elementCollaboration.senderId != this.creatorId) {
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

    this.creatorService.getBroadcastRequestOpen().subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listBroadcast.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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

    this.creatorService.getBroadcastRequestClosed().subscribe({
      next: (listCollaborations: CollaborationRequest[]) => {
        let tmpListIds = new Array<string>();
        listCollaborations.forEach((elementCollaboration: CollaborationRequest) => {
          index = this.listBroadcast.findIndex((elementRequest) => {
            return elementRequest.id == elementCollaboration.id;
          });
          if (index == -1) {
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
    if (listIds.length == 0) return;
    this.creatorService.getListofUser(listIds).subscribe({
      next: (listUsers: PublicUser[]) => {
        let index;
        listUsers.forEach((elementUser: PublicUser) => {
          index = listOutput.findIndex((element) => {
            return element.id == elementUser.id;
          });
          if (index == -1) listOutput.push(elementUser);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getUser(id: string): string {
    if (id == null) return "";
    let index = this.listUsersSent.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if (index != -1) {
      return this.listUsersSent[index].nickname;
    }

    index = this.listUsersSentBroadcast.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if (index != -1) {
      return this.listUsersSentBroadcast[index].nickname;
    }

    index = this.listUsersBroadcast.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if (index != -1) {
      return this.listUsersBroadcast[index].nickname;
    }

    index = this.listUsersReceived.findIndex((elementUser) => {
      return elementUser.id == id;
    });
    if (index != -1) {
      return this.listUsersReceived[index].nickname;
    }

    return "";
  }

  rejectRequest(request: CollaborationRequest) {
    if (request == null) return;
    this.creatorService.rejectRequest(request.id).subscribe({
      next: () => {
        console.log("Request rejected");
        let index = this.listReceived.findIndex((elementRequest) => {
          return request.id == elementRequest.id;
        });
        if (index != -1) this.listReceived[index].status = CollaborationRequestStatus.CLOSED;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  closeRequest(request: CollaborationRequest) {
    if (request == null) return;
    this.creatorService.rejectRequest(request.id).subscribe({
      next: () => {
        console.log("Request deleted");
        let index = this.listSent.findIndex((elementRequest) => {
          return request.id == elementRequest.id;
        });
        if (index != -1) this.listSent[index].status = CollaborationRequestStatus.CLOSED;

        index = this.listBroadcast.findIndex((elementRequest) => {
          return request.id == elementRequest.id;
        });
        if (index != -1) this.listBroadcast[index].status = CollaborationRequestStatus.CLOSED;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }
}
