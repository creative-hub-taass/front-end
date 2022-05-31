import {Component, OnInit} from '@angular/core';
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {Artwork} from "../../_models/Artwork";
import {Event} from "../../_models/Event"
import {Post} from "../../_models/Post";
import {EventBusService} from "../../_shared/event-bus.service";
import {CreatorService} from "../_services/creator.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import * as utility from "../../_shared/functions";

@Component({
  selector: 'app-collabs',
  templateUrl: './collabs.component.html',
  styleUrls: ['./collabs.component.css', '../about/about.component.css', '../portfolio/portfolio.component.css']
})
export class CollabsComponent implements OnInit {

  followed: boolean = false;
  sameId: boolean = false;
  userId: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string = "";
  listArtworks!: Artwork[];
  listEvents!: Event[];
  listPost!: Post[];
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
    this.listPublicationInfo = new Array<PublicationInfo>();
    this.creatorService.getArtworks(this.user.id).subscribe({
      next: (listArtworks: Artwork[]) => {
        this.listArtworks = new Array<Artwork>();
        let listPublicationsID: string[] = new Array<string>();
        let listPublicationsInfo = new Array<PublicationInfo>();
        listArtworks.forEach((elementArtwork: Artwork) => {
          if (elementArtwork.creations.length > 1) {
            this.listArtworks.push(elementArtwork);
            listPublicationsID.push(elementArtwork.id);
            listPublicationsInfo.push(new PublicationInfo(elementArtwork, elementArtwork.creations));
          }
        });
        callServiceInteractions(listPublicationsID,
          this.creatorService,
          listPublicationsInfo,
          this.eventBusService,
          this.errorMessage);
        listPublicationsInfo.forEach((elementPublication) => {
          this.listPublicationInfo.push(elementPublication);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.creatorService.getEvents(this.user.id).subscribe({
      next: (listEvents: Event[]) => {
        this.listEvents = new Array<Event>();
        let listPublicationsID: string[] = new Array<string>();
        let listPublicationsInfo = new Array<PublicationInfo>();
        listEvents.forEach((elementEvent: Event) => {
          if (elementEvent.creations.length > 1) {
            this.listEvents.push(elementEvent);
            listPublicationsID.push(elementEvent.id);
            listPublicationsInfo.push(new PublicationInfo(elementEvent, elementEvent.creations));
          }
        });
        callServiceInteractions(listPublicationsID,
          this.creatorService,
          listPublicationsInfo,
          this.eventBusService,
          this.errorMessage);
        listPublicationsInfo.forEach((elementPublication) => {
          this.listPublicationInfo.push(elementPublication);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.creatorService.getPosts(this.user.id).subscribe({
      next: (listPost: Post[]) => {
        this.listPost = new Array<Post>();
        let listPublicationsID: string[] = new Array<string>();
        let listPublicationsInfo = new Array<PublicationInfo>();
        listPost.forEach((elementPost: Post) => {
          if (elementPost.creations.length > 1) {
            this.listPost.push(elementPost);
            listPublicationsID.push(elementPost.id);
            listPublicationsInfo.push(new PublicationInfo(elementPost, elementPost.creations));
          }
        });
        callServiceInteractions(listPublicationsID,
          this.creatorService,
          listPublicationsInfo,
          this.eventBusService,
          this.errorMessage);
        listPublicationsInfo.forEach((elementPublication) => {
          this.listPublicationInfo.push(elementPublication);
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  getLikesCount(artworkId: string): number {
    if (this.listPublicationInfo == undefined) return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == artworkId;
    });
    if (index != -1) return this.listPublicationInfo[index].getLikes();
    return 0;
  }

  getCommentsCount(artworkId: string): number {
    if (this.listPublicationInfo == undefined) return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == artworkId;
    });
    if (index != -1) return this.listPublicationInfo[index].getComments().length;
    return 0;
  }

  SendCollaboration() {
    if(this.tokenStorageService.getUser().id == null) {
      window.location.replace("/login");
      return;
    }
    if(this.tokenStorageService.getUser().creator == null){
      window.location.replace("/upgrade-request");
      return;
    }
    window.location.replace("/modify-event/");
  }
}
