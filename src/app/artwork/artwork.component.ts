import {Component, OnInit} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute} from "@angular/router";
import {PublicationService} from "../_services/publication.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";

@Component({
  selector: "app-artwork",
  templateUrl: "./artwork.component.html",
  styleUrls: ["./artwork.component.css"]
})
export class ArtworkComponent implements OnInit {

  isLoggedIn!: boolean;
  artworkId: string | null;
  artwork!: Artwork;
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
    this.artworkId = this.route.snapshot.paramMap.get("id");
    this.isLoggedIn = loginComponent.isLoggedIn;
  }

  ngOnInit(): void {
    if (this.artworkId != null) {
      this.publicationService.getArtwork(this.artworkId).subscribe(
        (artwork) => {
          this.artwork = new Artwork(artwork);
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.artwork.creations);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti dell'artwork
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              });
              this.callServiceInteractions();
            },
            (error) => { utility.onError(error, this.eventBusService);}
          );
        },
        (error) => { utility.onError(error, this.eventBusService);}
      );
    }
  }

  //il metodo richiede il PublicUser e restituisce l'utente cercato all'interno della lista
  getUser(userParam: PublicUser): PublicUser {
    return utility.getUser(userParam, this.listUsers);
  }

  //restituisce un oggetto PublicUser con le informazioni di un utente
  //il metodo richiede il PublicUser
  getCreator(userParam: PublicUser): PublicCreator {
    return utility.getCreator(userParam, this.listUsers);
  }


  private callServiceInteractions() {
    if (this.artworkId != null) {
      this.publicationService.getLikes(this.artworkId).subscribe(
        (likesCount) => {
          this.countLikes = likesCount;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
      this.publicationService.getComments(this.artworkId).subscribe(
        (listComments) => {
          this.listComments = listComments;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
    }

  }
}
