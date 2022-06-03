import {Component, OnDestroy} from '@angular/core';
import {Creation} from "../../_models/Publication";
import {Post} from "../../_models/Post";
import {PublicUser} from "../../_models/PublicUser";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as utility from "../../_shared/functions";
import {CreationType, getListCreationTypeAP} from "../../_models/Enum";

export class CreationPost implements Creation {
  id: string;
  user: string;
  nickname: string;
  creationType: string;
  postId: string;

  constructor(id: string, postId: string, user: string, nickname: string, creationType: string) {
    this.id = id;
    this.user = user;
    this.nickname = nickname;
    this.creationType = creationType;
    this.postId = postId;
  }
}

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.css']
})
export class ModifyPostComponent implements OnDestroy {

  sent: boolean = false;
  postId: string | null;
  postResult!: Post;
  listUsersID!: string[];
  listUsers!: PublicUser[];
  errorMessage: string = "";
  listFollowers!: PublicUser[];
  listCreationPost!: CreationPost[];

  formPost: {
    title: string,
    body: string
  } = {
    title: "",
    body: ""
  }

  formCreations: {
    user?: PublicUser;
    creationType: CreationType
  } = {
    creationType: CreationType.OTHER
  };

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.postId = this.route.snapshot.paramMap.get('id');
    if(this.tokenStorageService.getUser().id == null) {
      window.location.replace("/login");
      return;
    }
    if(this.tokenStorageService.getUser().creator == null){
      window.location.replace("/upgrade-request");
      return;
    }
    if (this.postId != null) {
      this.publicationService.getPost(this.postId).subscribe({
        next: (post: Post) => {
          window.sessionStorage.setItem("postOrigin", JSON.stringify(post));
          this.postResult = new Post(post);
          this.listUsersID = new Array<string>();
          this.postResult.creations.forEach((creation) => {
            this.listUsersID.push(creation.user);
          });
          this.buildFormPostOrigin();
          this.publicationService.getListofUser(this.listUsersID).subscribe({
            next: (usersList: PublicUser[]) => {
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((publicUser) => {
                this.listUsers.push(new PublicUser(publicUser));
              });
              this.buildCreations();
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
    } else {
      this.buildFormPostEmpty();
      this.listCreationPost = new Array<CreationPost>();
    }
    this.publicationService.getListFollower(this.tokenStorageService.getUser().id).subscribe({
      next: (listFollower: PublicUser[]) => {
        this.listFollowers = new Array<PublicUser>();
        listFollower.forEach((follower) => {
          this.listFollowers.push(new PublicUser(follower));
        });
        this.listFollowers.push(this.tokenStorageService.getUser())
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }

  ngOnDestroy(): void {
    window.sessionStorage.removeItem("postOrigin");
  }

  private buildFormPostOrigin() {
    this.formPost.title = this.postResult.title;
    this.formPost.body = this.postResult.body;
  }

  private buildCreations() {
    this.listCreationPost = new Array<CreationPost>();
    this.listUsers.forEach((user) => {
      let index: number = this.postResult.creations.findIndex((elementCreation) => {
        return elementCreation.user == user.id;
      });
      this.listCreationPost.push(new CreationPost(this.postResult.creations[index].id, this.postResult.id, user.id, user.nickname, this.postResult.creations[index].creationType));
    });
  }

  private buildFormPostEmpty() {
    this.postResult = {
      publicationType: "post" as const,
      id: "",
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      creations: [],
      title: "",
      body: ""
    };
  }

  addInformations() {
    this.postResult.title = this.formPost.title;
    this.postResult.body = this.formPost.body;
  }

  resetForm() {
    const postOrigin = window.sessionStorage.getItem("postOrigin");
    if (!postOrigin) this.buildFormPostEmpty();
    else this.postResult = Object.assign<Post, Post>(this.postResult, JSON.parse(postOrigin));
    this.buildFormPostOrigin();
  }
/*
  onSubmit() {
    const post = window.sessionStorage.getItem("postOrigin");
    this.postResult.lastUpdate = new Date().toISOString();
    //sto modificando il post
    if (post) {
      //controllo nella nuova lista di creations quali non sono già presenti nella vecchia
      this.listCreationPost.forEach((elementCreationNew) => {
        let index = this.postResult.creations.findIndex((elementCreationOrigin) => {
          return elementCreationNew.user == elementCreationOrigin.user;
        });
        //se un creation non è già all'interno del post originale
        if (index == -1) {
          this.publicationService.savePostCreation(elementCreationNew).subscribe({
            next: (result) => {
              console.log("ho salvato il creation");
              console.log(result);
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        }
      });
      //devo eliminare tutte le creations che sono su origin e non sono sulla nuova lista
      this.postResult.creations.forEach((elementCreationOrigin) => {
        let index = this.listCreationPost.findIndex((elementCreationNew) => {
          return elementCreationNew.user == elementCreationOrigin.user;
        });
        //se non l'ho trovato lo cancello
        if (index == -1) {
          this.publicationService.deletePostCreation(elementCreationOrigin.id).subscribe({
            next: () => {
              console.log("Creation eliminata con successo");
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        }
      });
      this.publicationService.updatePost(this.postResult).subscribe({
        next: () => {
          console.log("Ho aggiornato il post correttamente");
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
      this.sent = true;
      return;
    }
    this.publicationService.savePost(this.postResult).subscribe({
      next: (responsePost) => {
        this.listCreationPost.forEach((elementCreation) => {
          elementCreation.postId = responsePost.id;
          this.publicationService.savePostCreation(elementCreation).subscribe({
            next: () => {
              console.log("Ho salvato correttamente il creation");
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
        this.router.navigate(['modify-post/' + responsePost.id]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }
*/
  addUsers() {
    if (this.formCreations.user == undefined) return;
    let tmpCreation: any = {};
    if (this.postId != null) {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        postId: this.postId
      }
    } else {
      tmpCreation = {
        id: "",
        user: this.formCreations.user.id,
        creationType: this.formCreations.creationType,
        postId: ""
      }
    }
    let index = this.listCreationPost.findIndex((elementCreationPost) => {
      return elementCreationPost.user == tmpCreation.user;
    });
    if (index != -1) return;
    let indexUser = this.listFollowers.findIndex((elementFollower) => {
      return elementFollower.id == tmpCreation.user;
    });
    this.listCreationPost.push(new CreationPost("", tmpCreation.postId, tmpCreation.user, this.listFollowers[indexUser].nickname, this.formCreations.creationType));
  }

  deleteUser(id: string) {
    const index = this.listCreationPost.findIndex((elementCreationPost) => {
      return elementCreationPost.id == id;
    });
    if(index == -1)return;
    this.listCreationPost.splice(index, 1);
  }

  getCreation(): CreationType[] {
    return getListCreationTypeAP();
  }


  onSubmit() {
    const post = window.sessionStorage.getItem("postOrigin");
    this.postResult.lastUpdate = new Date().toISOString();
    //sto modificando il post
    if (post) {
      this.updatePost();
    }else {
      //so creando il post
      this.savePost();
    }
  }

  private updatePost() {
    this.publicationService.updatePost(this.postResult).subscribe({
      next: () => {
        console.log("Ho aggiornato il post correttamente");
        this.listCreationPost.forEach((elementCreationNew) => {
          let index = this.postResult.creations.findIndex((elementCreationOrigin) => {
            return elementCreationNew.user == elementCreationOrigin.user;
          });
          //se un creation non è già all'interno del post originale
          if (index == -1) {
            this.publicationService.savePostCreation(elementCreationNew).subscribe({
              next: () => {
                console.log("ho salvato il creation");
              },
              error: (error) => {
                this.errorMessage = utility.onError(error, this.eventBusService);
              }
            });
          }
        });
        //devo eliminare tutte le creations che sono su origin e non sono sulla nuova lista
        this.postResult.creations.forEach((elementCreationOrigin) => {
          let index = this.listCreationPost.findIndex((elementCreationNew) => {
            return elementCreationNew.user == elementCreationOrigin.user;
          });
          //se non l'ho trovato lo cancello
          if (index == -1) {
            this.publicationService.deletePostCreation(elementCreationOrigin.id).subscribe({
              next: () => {
                console.log("Creation eliminata con successo");
              },
              error: (error) => {
                this.errorMessage = utility.onError(error, this.eventBusService);
              }
            });
          }
        });
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
    //controllo nella nuova lista di creations quali non sono già presenti nella vecchia

    this.sent = true;
  }

  private savePost() {
    this.publicationService.savePost(this.postResult).subscribe({
      next: (responsePost) => {
        this.listCreationPost.forEach((elementCreation) => {
          elementCreation.postId = responsePost.id;
          this.publicationService.savePostCreation(elementCreation).subscribe({
            next: () => {
              console.log("Ho salvato correttamente il creation");
            },
            error: (error) => {
              this.errorMessage = utility.onError(error, this.eventBusService);
            }
          });
        });
        this.router.navigate(['modify-post/' + responsePost.id]);
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
      }
    });
  }
}
