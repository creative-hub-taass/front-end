import { Component, OnInit } from '@angular/core';
import {Post} from "../../_models/Post";
import {PublicUser} from "../../_models/PublicUser";
import {LoginComponent} from "../login/login.component";
import {EventBusService} from "../../_shared/event-bus.service";
import {PublicationService} from "../_services/publication.service";
import * as utility from "../../_shared/functions";
import {ActivatedRoute} from "@angular/router";
import {PublicCreator} from "../../_models/PublicCreator";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  isLoggedIn!: boolean;
  postId: string | null;
  post!: Post;
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
    this.postId = this.route.snapshot.paramMap.get("id");
    this.isLoggedIn = loginComponent.isLoggedIn;
  }

  ngOnInit(): void {
    if(this.postId != null) {
      this.publicationService.getPost(this.postId).subscribe(
        (post) => {
          this.post = post;
          this.listUsersID = utility.buildUsersIDfromSpecificType(this.post.creations);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.publicationService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti del post
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
      this.publicationService.getLikes(this.postId).subscribe(
        (likesCount) => {
          this.countLikes = likesCount;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
      this.publicationService.getComments(this.postId).subscribe(
        (listComments) => {
          this.listComments = listComments;
        },
        (error) => { utility.onError(error, this.eventBusService); }
      );
    }
  }
}
