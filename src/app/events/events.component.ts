import { Component, OnInit } from '@angular/core';
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
import {Event} from "../../_models/Event"
import {PublicationInfo} from "../../_models/PublicationInfo";
import {EventBusService} from "../../_shared/event-bus.service";
import {CreatorService} from "../_services/creator.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import * as utility from "../../_shared/functions";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  followed: boolean = false;
  sameId: boolean = false;
  userId: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string = "";
  listEvents!: Event[];
  listPublicationInfo!: PublicationInfo[];

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    if (this.userId != null) {
      let userStorage: string | null = window.sessionStorage.getItem(this.userId);
      if (userStorage != null){
        this.user = new PublicUser(JSON.parse(userStorage));
        this.creator = new PublicCreator(this.user.creator);
        this.callServicePublications(utility.callServiceInteractions);
      }
    }
    if(this.tokenStorageService.getUser().id == undefined) return;
    let index = this.tokenStorageService.getUser().inspirerIds.findIndex((idUser: string) => {
      return idUser == this.userId;
    });
    this.followed = (index != -1);
    this.sameId = (this.tokenStorageService.getUser().id == this.userId);
  }

  ngOnInit(): void {
    if(this.userId == null) {
      this.errorMessage = "Error";
      return;
    }
    if(this.user != null) return;
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
    this.creatorService.getEvents(this.user.id).subscribe({
      next: (listEvents: Event[]) => {
        this.listEvents = new Array<Event>();
        let listPublicationsID: string[] = new Array<string>();
        this.listPublicationInfo = new Array<PublicationInfo>();
        listEvents.forEach((elementEvent: Event) => {
          this.listEvents.push(elementEvent);
          listPublicationsID.push(elementEvent.id);
          this.listPublicationInfo.push(new PublicationInfo(elementEvent, elementEvent.creations));
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

  getLikesCount(eventId: string): number {
    let index: number = this.listPublicationInfo.findIndex((elementPublication) => {
      return elementPublication.publication.id == eventId;
    });
    return this.listPublicationInfo[index].getLikes();
  }

  getCommentsCount(eventId: string): number {
    let index: number = this.listPublicationInfo.findIndex((elementPublication) => {
      return elementPublication.publication.id == eventId;
    });
    return this.listPublicationInfo[index].getComments().length;
  }
}
