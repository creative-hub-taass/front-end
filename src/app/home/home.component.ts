import {Component, OnInit} from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {LoginComponent} from "../login/login.component";
import {FeedService} from "../_services/feed.service";
import {EventData} from "../../_shared/event";
import {Post} from "../../_models/Post";
import {PublicUser} from "../../_models/PublicUser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listPublicationsID!: any[];
  listUsersID!: any[];

  listFeed!: Post[];

  listUsers!: PublicUser[];

  isLoggedIn!: boolean;

  constructor(
    private loginComponent: LoginComponent,
    private eventBusService: EventBusService,
    private feedService: FeedService
  ) { this.isLoggedIn = loginComponent.isLoggedIn }

  ngOnInit(): void {
    if (this.loginComponent.isLoggedIn) {
      this.feedService.getUserFeed(this.loginComponent.socialUser.id, 0).subscribe(
        (listPublicationsDto) => {

        },
        (error) => { this.onError(error); }
      )
    } else {
      this.feedService.getPublicFeed(0).subscribe(
        (listPublicationsDto) => {
          //creo la lista degli ID pubblicazioni
          this.listPublicationsID = this.buildPublicationsID(listPublicationsDto);
          //creo la lista degli ID utenti
          this.listUsersID = this.buildUsersID(listPublicationsDto);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.feedService.getListofUser(this.listUsersID).subscribe(
            (usersList : PublicUser[]) => {
              //ho la lista di tutti gli utenti del feed
              this.listUsers = [];
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              })
              //per ogni pubblicazione prendo la lista degli utenti
              this.listFeed = [];
              listPublicationsDto.forEach( (publicationDto : any) => {
                let usersofCreation: PublicUser[] = [];
                let creationArray : any[] = publicationDto.creations;
                //per ogni utente nella lista degli utenti inserisco le informazioni all'interno di una lista temporanea
                //della pubblicazione
                creationArray.forEach( (userCreation : any) => {
                  let index = this.listUsers.findIndex( object => {
                    return object.id == userCreation.user;
                  })
                  usersofCreation.push(usersList[index]);
                })

                //creo il feed
                this.listFeed.push(new Post(publicationDto, usersofCreation));
              })
              },
            (error) => { this.onError(error); }
          )
          //ho le informazioni degli utenti in this.listUsers
          //ho le informazioni delle pubblicazioni in listPublicationsDto

          //chiamo il serviceInteractions che mi restituisce i like e commenti di tutti i post
          this.callServiceInteractions();

          //alla fine avrò una lista di feed
          console.log(this.listFeed);

        },
        (error) => { this.onError(error); }
      )
    }
  }

  private buildUsersID(list: any[]): any[] {
      let tmp : any[] = [];
      list.forEach((PublicationDto) => {
        let creationsDto : any[]= PublicationDto.creations;
        creationsDto.forEach((userDto) => {
          tmp.push(userDto.user);
        })
      })
    return tmp;
  }

  private buildPublicationsID(list: any[]): any[] {
    if (list == undefined) return [];

    let tmp : any[] = [];
      list.forEach((element) => {
        tmp.push(element.id);
      })
    return tmp;
  }

  private callServiceUsers() {
    this.feedService.getListofUser(this.listUsersID).subscribe(
      (usersList) => {
        console.log(usersList);
        this.listUsers = usersList; },
      (error) => { this.onError(error); }
    )
  }


  private callServiceInteractions(){
    this.feedService.getLikesList(this.listPublicationsID).subscribe(
      (likesList) => {
        this.listFeed.forEach((feedHome) => {
          feedHome.setLikes(likesList[feedHome.getInfoPost().id]);
        })
      },
      (error) => { this.onError(error); }
    )
    this.feedService.getCommentsList(this.listPublicationsID).subscribe(
      (commentList) => {
        this.listFeed.forEach((feedHome) => {
          feedHome.setListComments(commentList[feedHome.getInfoPost().id]);
        })
      },
      (error) => { this.onError(error); }
    )
  }

  private onError(error: any): void {
    let message = error.error.message || error.error || error.message;
    if (message.status == 403)
      this.eventBusService.emit(new EventData('logout', null));
    console.log(message.toString());
  }
}
