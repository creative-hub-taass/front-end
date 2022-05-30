import {Component, OnDestroy, AfterViewInit} from '@angular/core';
import {Creation} from "../../_models/Publication";
import * as utility from "../../_shared/functions";
import {Event} from "../../_models/Event"
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable, Subscriber} from "rxjs";
import {getListCreationTypeE} from "../../_models/Enum";

export class CreationEvent implements Creation {
  id: string;
  user: string;
  nickname: string;
  creationType: string;
  eventId: string;

  constructor(id: string, eventId: string, user: string, nickname: string, creationType: string) {
    this.id = id;
    this.user = user;
    this.nickname = nickname;
    this.creationType = creationType;
    this.eventId = eventId;
  }
}

const icon = L.icon({
  iconUrl: '../../assets/img/marker-icon.png',
  shadowUrl: '../../assets/img/marker-shadow.png',
  popupAnchor: [13, 0]
});

const AUTH_TOKEN = environment.accessToken;

@Component({
  selector: 'app-modify-event',
  templateUrl: './modify-event.component.html',
  styleUrls: ['./modify-event.component.css']
})
export class ModifyEventComponent implements OnDestroy, AfterViewInit {

  sent: boolean = false;
  eventId: string | null;
  eventResult!: Event;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  errorMessage: string = "";
  listFollowers!: PublicUser[];
  listCreationEvent!: CreationEvent[];
  map: any;
  marker: any;

  formEvent: {
    name: string,
    description: string,
    image: string,
    locationName: string,
    startDateTime: string,
    endDateTime: string,
    bookingURL: string | null | undefined
  } = {
    name: "",
    description: "",
    image: "",
    locationName: "",
    startDateTime: "",
    endDateTime: "",
    bookingURL: ""
  };

  formCreations: {
    user?: PublicUser;
    creationType: string;
  } = {
    creationType: ""
  };

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    //prendo l'id dell'evento, se lo sto modificando, altrimenti lo sto creando nuovo
    this.eventId = this.route.snapshot.paramMap.get("id");
    //modifico l'evento
    if (this.eventId != null) {
      this.publicationService.getEvent(this.eventId).subscribe({
        next: (event: Event) => {
          //salvo in cache l'evento originale
          window.sessionStorage.setItem("eventOrigin", JSON.stringify(event));
          //salvo l'evento come risultato finale
          this.eventResult = new Event(event);
          this.loadMap();
          //creo la lista di ID degli utenti organizzatori dell'evento
          this.listUsersID = new Array<string>();
          this.eventResult.creations.forEach((creation) => {
            this.listUsersID.push(creation.user);
          });
          //costruisco il form event con le informazioni dell'evento originale
          this.buildFormEventOrigin();
          //chiedo al server le informazioni degli utenti organizzatori
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((publicUser) => {
                this.listUsers.push(new PublicUser(publicUser));
              });
              //costruisco il form creations con le informazioni degli utenti recuperati
              this.buildCreations();
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          })
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      })
    } else {
      //costruisco il form con informazioni di default
      this.buildFormEventEmpty();
      this.listCreationEvent = new Array<CreationEvent>();
      this.eventResult.coordinates.longitude = 4.886169433593751;
      this.eventResult.coordinates.latitude = 52.399067302933304;
    }

    //prendo i follower dell'utente che ha richiesto la modifica o creazione
    this.publicationService.getListFollower(this.tokenStorageService.getUser().id).subscribe(
      (listFollower: PublicUser[]) => {
        this.listFollowers = new Array<PublicUser>();
        listFollower.forEach((follower) => {
          this.listFollowers.push(new PublicUser(follower));
        });
        this.listFollowers.push(this.tokenStorageService.getUser())
      }, (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.eventId == null)this.loadMap();
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

    this.map.on('click', (e: any) => {
      this.map.removeLayer(this.marker);
      this.eventResult.coordinates.latitude = e.latlng.lat;
      this.eventResult.coordinates.longitude = e.latlng.lng;
      this.map.flyTo([e.latlng.lat, e.latlng.lng], e.zoom);
      this.marker = L.marker([e.latlng.lat, e.latlng.lng], {icon}).bindPopup('The event is located here');
      this.marker.addTo(this.map);
    });

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
        latitude: this.eventResult.coordinates.latitude,
        longitude: this.eventResult.coordinates.longitude
      });
      observer.complete();
    });
  }

  ngOnDestroy(): void {
    window.sessionStorage.removeItem("eventOrigin");
  }

  //inserisce i valori dell'evento restituito dal server nel form in locale
  private buildFormEventOrigin() {
    this.formEvent.name = this.eventResult.name;
    this.formEvent.description = this.eventResult.description;
    this.formEvent.image = this.eventResult.image;
    this.formEvent.locationName = this.eventResult.locationName;
    this.formEvent.startDateTime = this.eventResult.startDateTime;
    this.formEvent.endDateTime = this.eventResult.endDateTime;
    this.formEvent.bookingURL = this.eventResult.bookingURL;
  }

  //inserisce i valori delle creations nel form
  private buildCreations() {
    this.listUsers.forEach((user) => {
      let index: number = this.eventResult.creations.findIndex((elementCreation) => {
        return elementCreation.user == user.id;
      });
      this.listCreationEvent = new Array<CreationEvent>();
      this.listCreationEvent.push(new CreationEvent(this.eventResult.creations[index].id, this.eventResult.id, user.id, user.nickname, this.eventResult.creations[index].creationType));
    });
  }

  private buildFormEventEmpty() {
    this.eventResult = {
      publicationType: "event" as const,
      id: "",
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      creations: [],
      name: "",
      description: "",
      image: "",
      locationName: "",
      coordinates: {
        longitude: 4.886169433593751,
        latitude: 52.399067302933304,
      },
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      bookingURL: ""
    }
  }

  addInformations() {
    this.eventResult.name = this.formEvent.name;
    this.eventResult.description = this.formEvent.description;
    this.eventResult.image = this.formEvent.image;
    this.eventResult.locationName = this.formEvent.locationName;
    this.eventResult.startDateTime = new Date(this.formEvent.startDateTime).toISOString();
    this.eventResult.endDateTime = new Date(this.formEvent.endDateTime).toISOString();
    this.eventResult.bookingURL = (this.formEvent.bookingURL != null) ? this.formEvent.bookingURL : null;
  }

  resetForm() {
    const eventOrigin = window.sessionStorage.getItem("eventOrigin");
    if (!eventOrigin) this.buildFormEventEmpty();
    else this.eventResult = Object.assign<Event, Event>(this.eventResult, JSON.parse(eventOrigin));
    this.buildFormEventOrigin();
  }

  onSubmit() {
    let URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
    if(this.eventResult.bookingURL != undefined && !URL_REGEXP.test(this.eventResult.bookingURL)){
      this.errorMessage = "Booking URL need to be a valid URL.";
      return;
    }
    const event = window.sessionStorage.getItem("eventOrigin");
    //aggiorno il lastUpdate
    this.eventResult.lastUpdate = new Date().toISOString();
    if (event) {
      //mando nella richiesta solo le creation non presenti nell'event di origine
      let eventObj: Event = JSON.parse(event);
      this.eventResult.creations.forEach((elementCreation) => {
        let index = eventObj.creations.findIndex((elementOriginCreation) => {
          return elementOriginCreation.user == elementCreation.user;
        });
        if (index == -1) {
          this.publicationService.saveEventCreation(elementCreation).subscribe({
            next: (result) => {
              console.log(result);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        }
      });
      //mando richieste di eliminazione delle creation presenti nell'event originale
      eventObj.creations.forEach((elementOriginCreation) => {
        let index = this.eventResult.creations.findIndex((elementCreation) => {
          return elementCreation.id == elementOriginCreation.id;
        });
        if (index == -1) {
          this.publicationService.deleteEventCreation(elementOriginCreation.id);
        }
      });
      let tmpResult = Object.assign<{}, Event>({}, this.eventResult);
      tmpResult.creations = [];
      console.log(tmpResult);
      this.publicationService.updateEvent(tmpResult).subscribe({
        next: (resultEvent) => {
          console.log(resultEvent);
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
      this.sent = true;
      return;
    }
    //altrimenti devo eseguire una POST per creare l'artwork
    this.publicationService.saveEvent(this.eventResult).subscribe({
      next: (responseEvent) => {
        this.listCreationEvent.forEach((elementCreation) => {
          elementCreation.eventId = responseEvent.id;
          this.publicationService.saveEventCreation(elementCreation).subscribe({
            next: (responseCreation) => {
              console.log(responseCreation);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
        this.router.navigate(['modify-event/' + responseEvent.id]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  addUsers() {
    if (this.formCreations.user == undefined) return;
    let tmpCreation: any = {};
    if (this.eventId != null) {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        eventId: this.eventId
      }
    } else {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        eventId: ""
      }
    }
    let index = this.listCreationEvent.findIndex((elementCreationEvent) => {
      return elementCreationEvent.id == tmpCreation.id;
    });
    if (index != -1) return;
    //indice dell'utente dalla lista dei follower con l'id selezionato nella view
    //utile per prendere il nickname dell'utente inserito
    let indexUser = this.listFollowers.findIndex((elementFollower) => {
      return elementFollower.id == tmpCreation.user;
    });
    this.listCreationEvent.push(new CreationEvent("", tmpCreation.eventId, tmpCreation.user, this.listFollowers[indexUser].nickname, this.formCreations.creationType));
  }

  deleteUser(id: string) {
    const index = this.listCreationEvent.findIndex((elementCreationEvent) => {
      return elementCreationEvent.id == id;
    });
    this.listCreationEvent.splice(index, 1);
  }

  getCreation(): string[] {
    return getListCreationTypeE();
  }
}
