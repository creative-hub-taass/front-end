import {Component, OnInit} from '@angular/core';
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
import {EventBusService} from "../../_shared/event-bus.service";
import {CreatorService} from "../_services/creator.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute} from "@angular/router";
import * as utility from "../../_shared/functions";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {Artwork} from "../../_models/Artwork";
import {Event} from "../../_models/Event"

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  followed: boolean = false;
  sameId: boolean = false;
  userId!: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string | undefined;
  listArtworks!: Artwork[];
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
        this.creatorService.getArtworks(this.user.id).subscribe(
          (listArtworks: Artwork[]) => {
            this.listArtworks = new Array<Artwork>();
            let listPublicationsID : string[] = new Array<string>();
            this.listPublicationInfo = new Array<PublicationInfo>();
            listArtworks.forEach((elementArtwork) => {
              this.listArtworks.push(elementArtwork);
              listPublicationsID.push(elementArtwork.id);
              this.listPublicationInfo.push(new PublicationInfo(elementArtwork,elementArtwork.creations))
            });
            this.callServiceInteractions(listPublicationsID);
          }, (error) => {
            this.errorMessage = utility.onError(error, this.eventBusService);
          }
        );
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
    if (this.userId == null) {
      this.errorMessage = "Error";
      return;
    }
    if (this.user != null) return;
    this.creatorService.getCreator(this.userId).subscribe(
      (publicUser) => {
        this.user = new PublicUser(publicUser);
        this.creator = new PublicCreator(this.user.creator);
        window.sessionStorage.setItem(publicUser.id, JSON.stringify(this.user));
        this.creatorService.getPublications(this.user.id).subscribe(
          (listArtworks: Artwork[]) => {
            this.listArtworks = new Array<Artwork>();
            let listPublicationsID: string[] = new Array<string>();
            this.listPublicationInfo = new Array<PublicationInfo>();
            listArtworks.forEach((elementArtwork) => {
              this.listArtworks.push(elementArtwork);
              listPublicationsID.push(elementArtwork.id);
              this.listPublicationInfo.push(new PublicationInfo(elementArtwork,elementArtwork.creations));
            });
            this.callServiceInteractions(listPublicationsID);
          }, (error) => {
            this.errorMessage = utility.onError(error, this.eventBusService);
          }
        );
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
  }

  reload() {
    if (this.userId == null) return;
    this.creatorService.getCreator(this.userId).subscribe(
      (user: PublicUser) => {
        this.user = user;
        this.creator = user.creator;
        window.sessionStorage.setItem(user.id, JSON.stringify(user));
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
  }

  follow() {
    if (this.tokenStorageService.getUser().id == undefined) return;
    this.creatorService.setFollower(this.tokenStorageService.getUser().id, this.user.id).subscribe(
      (user) => {
        this.tokenStorageService.saveUser(user);
        this.user.fanIds.push(user.id);
        window.sessionStorage.setItem(this.user.id, JSON.stringify(this.user));
        this.followed = true;
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    )
  }

  unfollow() {
    if (this.tokenStorageService.getUser().id == undefined) return;
    this.creatorService.deleteFollower(this.tokenStorageService.getUser().id, this.user.id).subscribe(
      (user) => {
        let tmp: PublicUser = this.tokenStorageService.getUser();
        tmp.inspirerIds.splice(user.id, 1);
        this.tokenStorageService.saveUser(tmp);
        this.user = user;
        this.creator = user.creator;
        this.followed = false;
        window.sessionStorage.setItem(this.user.id, JSON.stringify(this.user));
      });
  }

  //esegue le chiamate al servizio interazioni per ricevere i likes e i commenti di tutte le pubblicazioni
  private callServiceInteractions(listPublicationsID: string[]) {
    this.creatorService.getLikesList(listPublicationsID).subscribe(
      (likesList) => {
        this.listPublicationInfo.forEach((elementPublication) => {
          elementPublication.setLikes(likesList[elementPublication.publication.id]);
        });
        console.log(this.listPublicationInfo);
      },
      (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
    this.creatorService.getCommentsList(listPublicationsID).subscribe(
      (commentList) => {
        this.listPublicationInfo.forEach((elementPublication) => {
          elementPublication.setListComments(commentList[elementPublication.publication.id]);
        });
        console.log(this.listPublicationInfo);
      },
      (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
  }

  getLikesCount(artworkId: string): number {
    let index: number = this.listPublicationInfo.findIndex((elementPublication) => {
      return elementPublication.publication.id == artworkId;
    });
    return this.listPublicationInfo[index].getLikes();
  }

  getCommentsCount(artworkId: string): number {
    let index: number = this.listPublicationInfo.findIndex((elementPublication) => {
      return elementPublication.publication.id == artworkId;
    });
    return this.listPublicationInfo[index].getComments().length;
  }
}
