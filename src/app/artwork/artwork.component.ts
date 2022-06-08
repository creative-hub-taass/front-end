import {Component, OnInit} from "@angular/core";
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicationService} from "../_services/publication.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";
import {PaymentService} from "../_services/payment.service";
import {Order} from "../../_models/Order";
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {PaymentResultComponent} from "../payment-result/payment-result.component";
import {delay} from "../../_shared/functions";

@Component({
  selector: "app-artwork",
  templateUrl: "./artwork.component.html",
  styleUrls: ["./artwork.component.css"]
})
export class ArtworkComponent implements OnInit {
  message: string = "";
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
  popup: boolean = false;
  buypoup: boolean = false;
  wait: boolean = false;

  constructor(
    private userService: UserService,
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private paymentService: PaymentService,
    private tokenStorageService: TokenStorageService,
    private paymentResult: PaymentResultComponent,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.artworkId = this.route.snapshot.paramMap.get("id");
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
    if (this.artworkId == null) return;
      this.publicationService.getLikes(this.artworkId).subscribe({
        next: (likesCount) => {
          this.countLikes = likesCount;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.getComments(this.artworkId).subscribe({
        next: (listComments: any[]) => {
          let listOfUsersComments: string[] = [];
          this.listOfUserNamesComments = [];
          this.listComments = [];
          listComments.forEach((comment)=> {
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
                  if (userFromInteractions == userFromUsers.id) flag = true;
                });
                if (!flag){
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
                    fanIds: [],
                  }));
                }
                flag = false;
                  });
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

      if(this.userId == null)return;

      this.publicationService.userCommentedPublication(this.userId, this.artworkId).subscribe({
        next: (userCommented) => {
          this.commented = userCommented;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.userLikedPublication(this.userId, this.artworkId).subscribe( {
        next: (userLiked) => {
          this.liked = userLiked;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

  }

  public buyArtwork(destinationAddress: string): void {
    if(this.userId == undefined){
      window.location.replace("/login");
      return;
    }
    this.artwork.creations.forEach((creation) => {
      if(creation.user == this.userId){
        window.location.replace("/artwork/" + this.artworkId);
        return;
      }
    })
    this.paymentService.buyArtwork(new Order(this.artwork, this.userId, destinationAddress)).subscribe({
      next: (urlPaypal: string) => {
        if(urlPaypal.includes("redirect",0)){
          (async () => {
            this.wait = true;
            await delay(8000);
            this.wait = false;
            window.location.href = encodeURI(urlPaypal.substring(9, urlPaypal.length));
          })();
          return;
        }
        this.router.navigate(['/payment-failed', urlPaypal]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    this.buypoup = true;
  }

  public addComment() {
    if(this.userId == null || !this.message || !this.artworkId) {
      window.location.replace("/login");
      return;
    }
    console.log("userId: " + this.userId);
    console.log("artworkId: " + this.artworkId);
    console.log("message: " + this.message);
    this.publicationService.addComment(this.userId, this.artworkId, this.message);
    this.message = "";
    this.callServiceInteractions();
  }

  public deleteComment(commentId: string) {
    if(this.userId == null) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.deleteComment(commentId).subscribe({
      next: () => {
        console.log("Ho eliminato correttamente il commento");
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    let index = this.listComments.findIndex((cid)=>{
      return cid == commentId;
    });
    if (index == -1)return;
    this.listComments.splice(index, 1);
  }

  public getUserUsername(userId: string): string {
    let index = this.listOfUserNamesComments.findIndex((uid) => {
      return uid.id == userId;
    })
    if (index == -1)return "";
    return this.listOfUserNamesComments[index].nickname;
  }

  public addLike() {
    if(this.userId == null || !this.artworkId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.addLike(this.userId, this.artworkId);
    this.liked= true;
    this.countLikes++;
  }

  public deleteLike() {
    if(this.userId == null || !this.artworkId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.deleteLike(this.userId, this.artworkId);
    this.liked = false;
    this.countLikes--;
  }

  public canEdit(): boolean{
    let index = this.listUsers?.findIndex((uid) => {
      return uid.id == this.userId;
    });
    return index != -1;

  }

  public togglePopup() {
    this.popup = !this.popup;
  }

  public toggleBuyPopup() {
    this.buypoup = !this.buypoup;
  }

  public delete() {
    this.artwork.creations.forEach((creation) => {
      this.publicationService.deleteArtworkCreation(creation.id).subscribe(s => {console.log(s);});
    });
    if(this.artworkId!=null) this.publicationService.deleteArtwork(this.artworkId).subscribe(s => {console.log(s);});
    this.popup = false;
  }

}
