import { Component, OnInit } from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";
import {TokenStorageService} from "../_services/token-storage.service";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {CreatorService} from "../_services/creator.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  followed: boolean = false;
  sameId: boolean = false;
  userId!: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string = "";
  listSellArtwork!: Artwork[]
  listPublicationInfo!: PublicationInfo[];

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    if(this.userId != null) {
      let userStorage: string | null = window.sessionStorage.getItem(this.userId);
      if(userStorage != null) {
        this.user = new PublicUser(JSON.parse(userStorage));
        this.creator = new PublicCreator(this.user.creator);
        this.callServicePublications(utility.callServiceInteractions);
      }
    }
    if(this.tokenStorageService.getUser().id == undefined) return;
    let index = this.tokenStorageService.getUser().inspirerIds.findIndex((idUser: string) => {
      return idUser == this.userId;
    });
    this.followed = (index!=-1);
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
    this.creatorService.getArtworks(this.user.id).subscribe({
      next: (listArtworks: Artwork[]) => {
        this.listSellArtwork = new Array<Artwork>();
        let listPublicationsID: string[] = new Array<string>();
        this.listPublicationInfo = new Array<PublicationInfo>();
        listArtworks.forEach((elementArtwork: Artwork) => {
          if(elementArtwork.onSale){
            this.listSellArtwork.push(elementArtwork);
            listPublicationsID.push(elementArtwork.id);
            this.listPublicationInfo.push(new PublicationInfo(elementArtwork, elementArtwork.creations));
          }
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

  getLikesCount(artworkId: string): number {
    if(this.listPublicationInfo == undefined)return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == artworkId;
    });
    if(index != -1) return this.listPublicationInfo[index].getLikes();
    return 0;
  }

  getCommentsCount(artworkId: string): number {
    if(this.listPublicationInfo == undefined)return 0;
    let index: number = this.listPublicationInfo.findIndex((elementPublication: PublicationInfo) => {
      return elementPublication.publication.id == artworkId;
    });
    if(index != -1)return this.listPublicationInfo[index].getLikes();
    return 0;
  }

}
