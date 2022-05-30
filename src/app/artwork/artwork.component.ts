import {Component, OnInit} from "@angular/core";
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute} from "@angular/router";
import {PublicationService} from "../_services/publication.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";
import {PaymentService} from "../_services/payment.service";
import {Order} from "../../_models/Order";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {getUser} from "../../_shared/functions";
import {User} from "../../_models/User";
import {Observable} from "rxjs";


@Component({
  selector: "app-artwork",
  templateUrl: "./artwork.component.html",
  styleUrls: ["./artwork.component.css"]
})
export class ArtworkComponent implements OnInit {
  message: string = "";
  isLoggedIn: boolean = false;
  artworkId: string | null;
  artwork!: Artwork;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  listOfUserNamesComments!: PublicUser[];
  countLikes!: number;
  listComments!: any[];
  errorMessage: string = "";
  userId: string = "";
  liked: boolean = false;
  commented: boolean = false;

  constructor(
    private userService: UserService,
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private paymentService: PaymentService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get("id");
    this.isLoggedIn = (Object.keys(this.tokenStorageService.getUser()).length != 0)
    this.userId = this.tokenStorageService.getUser().id;
  }

  ngOnInit(): void {
    if (this.artworkId != null) {
      this.publicationService.getArtwork(this.artworkId).subscribe({
        next: (artwork) => {
          this.artwork = new Artwork(artwork);
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.artwork.creations);
          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti dell'artwork
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
      this.publicationService.getLikes(this.artworkId).subscribe({
        next: (likesCount) => {
          this.countLikes = likesCount;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.userCommentedPublication(this.tokenStorageService.getUser().id, this.artworkId).subscribe({
        next: (userCommented) => {
          this.commented = userCommented;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.userLikedPublication(this.tokenStorageService.getUser().id, this.artworkId).subscribe( {
        next: (userLiked) => {
          this.liked = userLiked;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      })

      this.publicationService.getComments(this.artworkId).subscribe({
        next: (listComments: any[]) => {
          let listOfUsersComments = new Array();
          this.listOfUserNamesComments = new Array();
          this.listComments = new Array();
          listComments.forEach((comment)=> {
            let index = listOfUsersComments.findIndex((uid) => {
              return uid == comment.userId;
            });
            if (index == -1) listOfUsersComments.push(comment.userId);
            this.listComments.push(comment);
          })
          this.publicationService.getListofUser(listOfUsersComments).subscribe({
            next: (listUser: PublicUser[]) => {
              this.listOfUserNamesComments = listUser;
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
  public buyArtwork(destinationAddress: string): void {
    this.paymentService.buyArtwork(new Order(this.artwork, this.tokenStorageService.getUser().id, destinationAddress)).subscribe({
      next: (urlPaypal: string) => {
        let url: string = urlPaypal.substring(9, urlPaypal.length);
        window.location.href = encodeURI(url);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  public addComment() {
    if (!this.message) return;
    if (!this.artworkId) return;
    console.log("userId: " + this.tokenStorageService.getUser().id);
    console.log("artworkId: " + this.artworkId);
    console.log("message: " + this.message);
    this.publicationService.addComment(this.tokenStorageService.getUser().id, this.artworkId, this.message);
    this.message = "";
    this.callServiceInteractions();
  }

  public deleteComment(commentId: string) {
    this.publicationService.deleteComment(commentId);
    let index = this.listComments.findIndex((cid)=>{
      return cid == commentId;
    });
    this.listComments.splice(index, 1);
  }

  public getUserUsername(userId: string): string {
    let index = this.listOfUserNamesComments.findIndex((uid) => {
      return uid.id == userId;
    })
    return this.listOfUserNamesComments[index].nickname;
  }

  public addLike() {
    if (!this.isLoggedIn) return;
    if(!this.artworkId) return;
    this.publicationService.addLike(this.tokenStorageService.getUser().id, this.artworkId);
    this.liked= true;
    this.countLikes++;
  }

  public deleteLike() {
    if (!this.isLoggedIn) return;
    if(!this.artworkId) return;
    this.publicationService.deleteLike(this.tokenStorageService.getUser().id, this.artworkId);
    this.liked = false;
    this.countLikes--;
  }
}
