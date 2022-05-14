import { Component, OnInit } from '@angular/core';
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

  sameId: boolean = false;
  userId!: string | null;
  user!: PublicUser;
  creator!: PublicCreator;
  errorMessage: string | undefined;
  listPublication!: PublicationInfo[];

  constructor(
    private eventBusService: EventBusService,
    private creatorService: CreatorService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    if(this.userId != null){
      let userStorage: string | null = window.sessionStorage.getItem(this.userId);
      if(userStorage != null) {
        this.user = new PublicUser(JSON.parse(userStorage));
        this.creator = new PublicCreator(this.user.creator);
        this.creatorService.getPublications(this.user.id).subscribe(
          (listPublication: PublicationInfo[]) => {
            this.listPublication = new Array<PublicationInfo>();
            listPublication.forEach((publication) => {
              this.listPublication.push(publication);
            });
            console.log(this.listPublication);
          }, (error) => {
            this.errorMessage = utility.onError(error, this.eventBusService);
          }
        );
      }
    }
    this.sameId = (this.tokenStorageService.getUser().id == this.userId);
  }

  ngOnInit(): void {
    if(this.userId == null) {
      this.errorMessage = "Error";
      return;
    }
    if(this.user != null) return;
    this.creatorService.getCreator(this.userId).subscribe(
      (publicUser) => {
        this.user = new PublicUser(publicUser);
        this.creator = new PublicCreator(this.user.creator);
        window.sessionStorage.setItem(publicUser.id, JSON.stringify(this.user));
        this.creatorService.getPublications(this.user.id).subscribe(
          (listPublication: PublicationInfo[]) => {
            this.listPublication = new Array<PublicationInfo>();
            listPublication.forEach((publication) => {
              if(publication.publication.publicationType == "artwork" || publication.publication.publicationType == "event")
              this.listPublication.push(publication);
            });
            console.log(this.listPublication);
          }, (error) => {
            this.errorMessage = utility.onError(error, this.eventBusService);
          }
        );
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    );
  }

  getPublication(publication: PublicationInfo): Event | Artwork | undefined {
    if(publication.publication.publicationType == 'artwork'){
      return publication.publication;
    } else if(publication.publication.publicationType == 'event'){
      return publication.publication;
    }
    return undefined;
  }
}
