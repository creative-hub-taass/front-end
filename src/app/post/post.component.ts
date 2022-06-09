import {Component, OnInit} from "@angular/core";
import {Post} from "../../_models/Post";
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicCreator} from "../../_models/PublicCreator";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css", "../artwork/artwork.component.css"]
})
export class PostComponent implements OnInit {

  postId: string | null;
  post!: Post;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  countLikes!: number;
  listComments!: any[];
  errorMessage: string = "";
  message!: string;
  liked: boolean = false;
  commented: boolean = false;
  listOfUserNamesComments!: PublicUser[];
  userId: string = "";
  popup: boolean = false;

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.postId = this.route.snapshot.paramMap.get("id");
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
      );
    }
  }

  public addComment() {
    if (this.userId == null || !this.message || !this.postId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.addComment(this.userId, this.postId, this.message).subscribe({
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

  public getUserUsername(userId: string): string {
    let index = this.listOfUserNamesComments.findIndex((uid) => {
      return uid.id == userId;
    });
    if (index == -1) return "";
    return this.listOfUserNamesComments[index].nickname;
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

  private callServiceInteractions() {
    if (this.postId == null) return;
    this.publicationService.getLikes(this.postId).subscribe({
      next: (likesCount) => {
        this.countLikes = likesCount;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });

    this.publicationService.getComments(this.postId).subscribe({
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

    this.publicationService.userCommentedPublication(this.userId, this.postId).subscribe({
      next: (userCommented) => {
        this.commented = userCommented;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });

    this.publicationService.userLikedPublication(this.userId, this.postId).subscribe({
      next: (userLiked) => {
        this.liked = userLiked;
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  public addLike() {
    if (this.userId == null || !this.postId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.addLike(this.userId, this.postId);
    this.liked = true;
    this.countLikes++;
  }

  public deleteLike() {
    if (this.userId == null || !this.postId) {
      window.location.replace("/login");
      return;
    }
    this.publicationService.deleteLike(this.userId, this.postId);
    this.liked = false;
    this.countLikes--;
  }

  public canEdit(): boolean {
    let index = this.listUsers?.findIndex((uid) => {
      return uid.id == this.userId;
    });
    return index != -1;

  }

  public togglePopup() {
    this.popup = !this.popup;
  }

  public delete() {
    this.post.creations.forEach((creation) => {
      this.publicationService.deleteArtworkCreation(creation.id).subscribe(s => {
        console.log(s);
      });
    });
    if (this.postId != null) this.publicationService.deletePost(this.postId).subscribe(s => {
      console.log(s);
    });
    this.popup = false;
    window.location.replace("/home");
  }

}


