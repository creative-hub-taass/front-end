import { Component, OnInit } from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute} from "@angular/router";
import {PublicationService} from "../_services/publication.service";
import {Publication} from "../../_models/Publication";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";

@Component({
  selector: 'app-artwork',
  templateUrl: './artwork.component.html',
  styleUrls: ['./artwork.component.css']
})
export class ArtworkComponent implements OnInit {

  isLoggedIn!: boolean;
  artworkId: string | null;
  artwork!: Publication;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  countLikes!: number;
  listComments!: any[];


  constructor(
    private loginComponent: LoginComponent,
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get('id');
    this.isLoggedIn = loginComponent.isLoggedIn;
  }

  ngOnInit(): void {
    if(this.artworkId!=null){
      this.publicationService.getPublication(this.artworkId).subscribe(
        (artwork) => {
          this.artwork = new Publication(artwork);
          console.log(this.artwork);
          this.listUsersID = utility.buildUsersIDfromArtwork(this.artwork.getCreations());

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti della pubblicazione
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              })
              this.callServiceInteractions();
              console.log(this.artwork);
              },
            (error) => { utility.onError(error, this.eventBusService);}
          )
        },
        (error) => { utility.onError(error, this.eventBusService);}
      )
    }
  }

  private callServiceInteractions() {
    if(this.artworkId!=null){
      this.publicationService.getLikes(this.artworkId).subscribe(
        (likesCount) => {
          this.countLikes = likesCount;
        },
        (error) => { utility.onError(error,this.eventBusService); }
      )
      this.publicationService.getComments(this.artworkId).subscribe(
        (listComments) => {
          this.listComments = listComments;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      )
    }

  }

  //restituisce un oggetto PublicUser con le informazioni di un utente
  //il metodo richiede il PublicUser e la lista di PublicUser in cui cercare
  getUser(userParam: PublicUser): PublicUser {
    return utility.getUser(userParam, this.listUsers);
  }

  //restituisce un oggetto PublicCreator con le informazioni dell'utente creator
  //il metodo richiede il PublicUser e la lista di utenti in cui cercare
  getCreator(userParam: PublicUser): PublicCreator {
    return utility.getCreator(userParam, this.listUsers);
  }
}