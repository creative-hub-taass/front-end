import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Event} from "../../_models/Event"
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable, Subscriber} from "rxjs";

const icon = L.icon({
  iconUrl: '../../assets/img/marker-icon.png',
  shadowUrl: '../../assets/img/marker-shadow.png',
  popupAnchor: [13, 0]
});

const AUTH_TOKEN = environment.accessToken;


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {

  isLoggedIn: boolean = false;
  eventId: string | null;
  event!: Event;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  countLikes!: number;
  listComments!: any[];
  errorMessage: string = "";
  map: any;
  marker: any;


  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    public route: ActivatedRoute
  ) {
    this.eventId = this.route.snapshot.paramMap.get("id");
    this.isLoggedIn = (Object.keys(this.tokenStorageService.getUser()).length != 0)
  }

  ngOnInit(): void {
    if (this.eventId != null) {
      this.publicationService.getEvent(this.eventId).subscribe({
        next: (event) => {
          this.event = new Event(event);
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.event.creations);
          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti dell'evento
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element: PublicUser) => {
                this.listUsers.push(new PublicUser(element));
              });
              this.callServiceInteractions();
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    }
  }


  private callServiceInteractions() {
    if (this.eventId != null) {
      this.publicationService.getLikes(this.eventId).subscribe({
        next: (likesCount) => {
          this.countLikes = likesCount;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
      this.publicationService.getComments(this.eventId).subscribe({
        next: (listComments) => {
          this.listComments = listComments;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
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

  ngAfterViewInit(): void {
    this.loadMap();
  }

  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + AUTH_TOKEN, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: AUTH_TOKEN
    }).addTo(this.map);

    this.getCurrentPosition()
      .subscribe((position: any) => {
        this.map.flyTo([position.latitude, position.longitude], 10);

        this.marker = L.marker([position.latitude, position.longitude], {icon}).bindPopup('The event is located here');
        this.marker.addTo(this.map);
      });
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      observer.next({
        latitude: this.event.coordinates.latitude,
        longitude: this.event.coordinates.longitude
      });
      observer.complete();
    });
  }
}
