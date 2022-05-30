import {Component, OnInit} from '@angular/core';
import {Post} from "../../_models/Post";
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css', '../artwork/artwork.component.css']
})
export class PostComponent implements OnInit {

  isLoggedIn: boolean = false;
  postId: string | null;
  post!: Post;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  countLikes!: number;
  listComments!: any[];
  errorMessage: string = "";
  message!: string;
  liked: boolean = false;
  commented: boolean= false;
  listOfUserNamesComments!: PublicUser[];
  userId: string = "";

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.postId = this.route.snapshot.paramMap.get("id");
    if (this.tokenStorageService.getUser() != null) this.isLoggedIn = true;
    this.userId = this.tokenStorageService.getUser().id;
  }

  ngOnInit(): void {
    if (this.postId != null) {
      this.publicationService.getPost(this.postId).subscribe(
        (post) => {
          this.post = post;
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.post.creations);
          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti del post
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
        (error) => {
          utility.onError(error, this.eventBusService);
        }
      )
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
    if (this.postId != null) {
      this.publicationService.getLikes(this.postId).subscribe({
        next: (likesCount) => {
          this.countLikes = likesCount;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.userCommentedPublication(this.tokenStorageService.getUser().id, this.postId).subscribe({
        next: (userCommented) => {
          this.commented = userCommented;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });

      this.publicationService.userLikedPublication(this.tokenStorageService.getUser().id, this.postId).subscribe( {
        next: (userLiked) => {
          this.liked = userLiked;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      })

      this.publicationService.getComments(this.postId).subscribe({
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

  public addComment() {
    if (!this.message) return;
    if (!this.postId) return;
    console.log("userId: " + this.tokenStorageService.getUser().id);
    console.log("artworkId: " + this.postId);
    console.log("message: " + this.message);
    this.publicationService.addComment(this.tokenStorageService.getUser().id, this.postId, this.message);
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
    if(!this.postId) return;
    this.publicationService.addLike(this.tokenStorageService.getUser().id, this.postId);
    this.liked= true;
    this.countLikes++;
  }

  public deleteLike() {
    if (!this.isLoggedIn) return;
    if(!this.postId) return;
    this.publicationService.deleteLike(this.tokenStorageService.getUser().id, this.postId);
    this.liked = false;
    this.countLikes--;
  }
}


