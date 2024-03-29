import {Component, OnInit} from "@angular/core";
import {Event} from "../../_models/Event";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicUser} from "../../_models/PublicUser";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";
import * as L from "leaflet";
import {environment} from "../../environments/environment";
import {Observable, Subscriber} from "rxjs";
import {Router} from "@angular/router"

const icon = L.icon({
  iconUrl: "../../assets/img/marker-icon.png",
  shadowUrl: "../../assets/img/marker-shadow.png",
  popupAnchor: [13, 0]
});

const AUTH_TOKEN = environment.accessToken;

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css", "../artwork/artwork.component.css"]
})
export class EventComponent implements OnInit {

  eventId: string | null;
  event!: Event;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  countLikes!: number;
  listComments!: any[];
  errorMessage: string = "";
  map: any;
  marker: any;
  message!: string;
  liked: boolean = false;
  commented: boolean = false;
  listOfUserNamesComments!: PublicUser[];
  userId: string = "";
  popup: boolean = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.eventId = this.route.snapshot.paramMap.get("id");
    this.userId = this.tokenStorageService.getUser().id;
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
          this.loadMap();
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    }
  }

  public addComment() {
    if (this.userId == null || !this.message || !this.eventId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.addComment(this.userId, this.eventId, this.message).subscribe({
      next: (comment) => {
        this.listComments.push(comment);
        this.publicationService.getUser(this.userId).subscribe({
          next: (userofComment: PublicUser) => {
            if (userofComment != null) this.listOfUserNamesComments.push(userofComment);
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
    this.message = "";
  }

  public deleteComment(commentId: string) {
    if (this.userId == null) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.deleteComment(commentId).subscribe({
      next: () => {
        let index = this.listComments.findIndex((elementComment) => {
          return elementComment.id == commentId;
        });
        this.listComments.splice(index, 1);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
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

  public getUserUsername(userId: string): string {
    if (userId == null) return "";
    let index = this.listOfUserNamesComments.findIndex((uid) => {
      return uid.id == userId;
    });
    if (index == -1) return "";
    return this.listOfUserNamesComments[index].nickname;
  }

  public addLike() {
    if (this.userId == null || !this.eventId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.addLike(this.userId, this.eventId);
    this.liked = true;
    this.countLikes++;
  }

  public deleteLike() {
    if (this.userId == null || !this.eventId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.deleteLike(this.userId, this.eventId);
    this.liked = false;
    this.countLikes--;
  }

  public canEdit(): boolean {
    let index = this.listUsers?.findIndex((uid) => {
      return uid.id == this.userId;
    });
    return index != -1;

  }

  public delete() {
    if (this.eventId != null) this.publicationService.deleteEvent(this.eventId).subscribe(s => {
      console.log(s);
      this.router.navigate(['/home']);
    });
    this.popup = false;
  }


  /*  ngAfterViewInit(): void {
      if(this.event != null)this.loadMap();
    }*/

  private callServiceInteractions() {
    if (this.eventId == null) return;
    this.publicationService.getLikes(this.eventId).subscribe({
      next: (likesCount) => {
        this.countLikes = likesCount;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });

    this.publicationService.getComments(this.eventId).subscribe({
      next: (listComments: any[]) => {
        let listOfUsersComments: string[] = [];
        this.listOfUserNamesComments = [];
        this.listComments = [];
        listComments.forEach((comment) => {
          let index = listOfUsersComments.findIndex((uid) => {
            return uid == comment.userId;
          });
          if (index == -1) listOfUsersComments.push(comment.userId);
          this.listComments.push(comment);
        });
        this.publicationService.getListofUser(listOfUsersComments).subscribe({
          next: (listUser: PublicUser[]) => {
            let flag = false;
            listOfUsersComments.forEach((userFromInteractions) => {
              listUser.forEach((userFromUsers) => {
                if (userFromUsers != null && userFromInteractions == userFromUsers.id) flag = true;
              });
              if (!flag) {
                listUser.push(new PublicUser({
                  id: userFromInteractions,
                  username: "",
                  nickname: "User deleted",
                  creator: new PublicCreator({
                    id: "",
                    bio: "",
                    creatorType: "",
                    avatar: ""
                  }),
                  inspirerIds: [],
                  fanIds: []
                }));
              }
              flag = false;
            });
            listUser.forEach((user) => {
              if (user != null) this.listOfUserNamesComments.push(user);
            });
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

    if (this.userId == null) return;

    this.publicationService.userCommentedPublication(this.userId, this.eventId).subscribe({
      next: (userCommented) => {
        this.commented = userCommented;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });

    this.publicationService.userLikedPublication(this.userId, this.eventId).subscribe({
      next: (userLiked) => {
        this.liked = userLiked;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  public togglePopup() {
    this.popup = !this.popup;
  }

  private loadMap(): void {
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + AUTH_TOKEN, {
      //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: AUTH_TOKEN
    }).addTo(this.map);

    this.getCurrentPosition()
      .subscribe((position: any) => {
        this.map.flyTo([position.latitude, position.longitude], 10);

        this.marker = L.marker([position.latitude, position.longitude], {icon}).bindPopup("The event is located here");
        this.marker.addTo(this.map);
      });
  }

}
