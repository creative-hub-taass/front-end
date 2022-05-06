import { Component, OnInit } from '@angular/core';
import { Event } from "../../_models/Event"
import {LoginComponent} from "../login/login.component";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  isLoggedIn!: boolean;
  eventId: string | null;
  event!: Event;
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
    this.eventId = this.route.snapshot.paramMap.get("id");
    this.isLoggedIn = loginComponent.isLoggedIn;
  }

  ngOnInit(): void {
    if(this.eventId != null) {
      this.publicationService.getEvent(this.eventId).subscribe(
        (event) => {
          this.event = new Event(event);
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.event.creations);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti dell'evento
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              });
              this.callServiceInteractions();
            },
            (error) => { utility.onError(error, this.eventBusService); }
          )
        },
        (error) => { utility.onError(error, this.eventBusService); }
      )
    }
  }

  private callServiceInteractions() {
    if (this.eventId != null) {
      this.publicationService.getLikes(this.eventId).subscribe(
        (likesCount) => {
          this.countLikes = likesCount;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
      this.publicationService.getComments(this.eventId).subscribe(
        (listComments) => {
          this.listComments = listComments;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
    }
  }

  //il metodo richiede il PublicUser e la lista di PublicUser in cui cercare
  getUser(userParam: PublicUser): PublicUser {
    return utility.getUser(userParam, this.listUsers);
  }

  //restituisce un oggetto PublicUser con le informazioni di un utente

  //il metodo richiede il PublicUser e la lista di utenti in cui cercare
  getCreator(userParam: PublicUser): PublicCreator {
    return utility.getCreator(userParam, this.listUsers);
  }
}
