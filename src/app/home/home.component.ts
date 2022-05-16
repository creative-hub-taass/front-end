import {Component, OnInit} from "@angular/core";
import {EventBusService} from "../../_shared/event-bus.service";
import {FeedService} from "../_services/feed.service";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";
import {Event} from "../../_models/Event";
import {Post} from "../../_models/Post";
import {TokenStorageService} from "../_services/token-storage.service";
import {CreatorService} from "../_services/creator.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  isLoggedIn: boolean = false;
  listPublicationsID!: any[];
  listUsersID!: any[];
  listFeed!: PublicationInfo[];
  listUsers!: PublicUser[];
  errorMessage: string = "";

  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService,
    private feedService: FeedService,
    private creatorService: CreatorService
  ) {
    this.isLoggedIn = (Object.keys(this.tokenStorageService.getUser()).length != 0)
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.feedService.getUserFeed(this.tokenStorageService.getUser().id, 0).subscribe({
        next: (listPublicationsDto) => {
          this.callServiceUsers(listPublicationsDto, utility.callServiceInteractions);
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    } else {
      this.feedService.getPublicFeed(0).subscribe({
        next: (listPublicationsDto) => {
          this.callServiceUsers(listPublicationsDto, utility.callServiceInteractions);
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    }
  }

  //restituisce un oggetto PublicUser con le informazioni di un utente
  getUser(userParam: PublicUser): PublicUser {
    return utility.getUser(userParam, this.listUsers);
  }

  //restituisce un oggetto PublicCreator con le informazioni dell'utente creator
  getCreator(userParam: PublicUser): PublicCreator {
    return utility.getCreator(userParam, this.listUsers);
  }

  //restituisce un oggetto Artwork | Event | Post in base al currentType
  getCurrentPublication(publicationInfo: PublicationInfo): Event | Post | Artwork {
    switch (publicationInfo.publication.publicationType) {
      case "artwork":
        return publicationInfo.publication;
      case "event":
        return publicationInfo.publication;
      case "post":
        return publicationInfo.publication;
    }
  }

  //costruisce la lista di ID pubblicazioni da mandare al servizio interazioni
  private buildPublicationsID(list: any[]): any[] {
    if (list == undefined) return [];

    let tmp: any[] = [];
    list.forEach((element) => {
      tmp.push(element.id);
    });
    return tmp;
  }

  callServiceUsers(listPublicationDto: PublicationInfo[], callServiceInteractions: any): void {
    //creo la lista degli ID pubblicazioni
    this.listPublicationsID = this.buildPublicationsID(listPublicationDto);
    //creo la lista degli ID utenti
    this.listUsersID = this.buildUsersIDfromPublication(listPublicationDto);
    //chiamo il servizio utenti per avere le informazioni sui creator
    this.feedService.getListofUser(this.listUsersID).subscribe({
      next: (userList: PublicUser[]) => {
        //ho la lista di tutti gli utenti del feed
        this.listUsers = new Array<PublicUser>();
        userList.forEach((elementUser: PublicUser) => {
          this.listUsers.push(new PublicUser(elementUser));
        });
        //per ogni pubblicazione prendo la lista degli utenti
        this.listFeed = new Array<PublicationInfo>();
        listPublicationDto.forEach((publicationDto: any) => {
          let usersofCreation: PublicUser[] = new Array<PublicUser>();
          let creationArray: any[] = publicationDto.creations;
          //per ogni utente nella lista degli utenti inserisco le informazioni all'interno di una lista temporanea
          //della pubblicazione
          creationArray.forEach((userCreation: any) => {
            let index = this.listUsers.findIndex((user) => {
              return user.id == userCreation.user;
            });
            usersofCreation.push(userList[index]);
          });
          //creo il feed
          this.listFeed.push(new PublicationInfo(publicationDto, usersofCreation));
        });
        //ho le informazioni degli utenti in this.listUsers
        //ho le informazioni delle pubblicazioni in listPublicationsDto

        //chiamo il serviceInteractions che mi restituisce i like e commenti di tutti i post
        callServiceInteractions(this.listPublicationsID,
          this.creatorService,
          this.listFeed,
          this.eventBusService,
          this.errorMessage);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    })
  }

  //costruisce la lista di id utente da mandare al servizio utenti (campo creation di PublicUserDto)
  private buildUsersIDfromPublication(list: any[]): any[] {
    let tmp: any[] = [];
    list.forEach((PublicationDto) => {
      let creationsDto: any[] = PublicationDto.creations;
      creationsDto.forEach((userDto) => {
        if (!tmp.includes(userDto.user)) tmp.push(userDto.user);
      });
    });
    return tmp;
  }
}
