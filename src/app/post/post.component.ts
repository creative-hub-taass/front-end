import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./post.component.css']
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

  constructor(
    private eventBusService: EventBusService,
    private publicationService: PublicationService,
    private tokenStorageService: TokenStorageService,
    public route: ActivatedRoute
  ) {
    this.postId = this.route.snapshot.paramMap.get("id");
    if(this.tokenStorageService.getUser() != null) this.isLoggedIn = true;
  }

  ngOnInit(): void {
    if(this.postId != null) {
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
        (error) => { utility.onError(error, this.eventBusService); }
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
    if (this.postId!= null) {
      this.publicationService.getLikes(this.postId).subscribe({
        next: (likesCount) => {
          this.countLikes = likesCount;
        },
        error: (error) => {this.errorMessage = utility.onError(error, this.eventBusService);}
      });
      this.publicationService.getComments(this.postId).subscribe({
        next: (listComments) => {
          this.listComments = listComments;
        },
        error: (error) => {
          this.errorMessage = utility.onError(error, this.eventBusService);
        }
      });
    }
  }

}
