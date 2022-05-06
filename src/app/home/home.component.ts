import {Component, OnInit} from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {LoginComponent} from "../login/login.component";
import {FeedService} from "../_services/feed.service";
import {PublicationInfo} from "../../_models/PublicationInfo";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listPublicationsID!: any[];
  listUsersID!: any[];

  listFeed!: PublicationInfo[];

  listUsers!: PublicUser[];

  isLoggedIn!: boolean;


  constructor(
    private loginComponent: LoginComponent,
    private eventBusService: EventBusService,
    private feedService: FeedService
  ) {
    this.isLoggedIn = loginComponent.isLoggedIn;
  }

  ngOnInit(): void {
    if (this.loginComponent.isLoggedIn) {
      this.feedService.getUserFeed(this.loginComponent.socialUser.id, 0).subscribe(
        (listPublicationsDto) => {
          //creo la lista degli ID pubblicazioni
          this.listPublicationsID = this.buildPublicationsID(listPublicationsDto);
          //creo la lista degli ID utenti
          this.listUsersID = utility.buildUsersIDfromPublication(listPublicationsDto);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.feedService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti del feed
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              })
              //per ogni pubblicazione prendo la lista degli utenti
              this.listFeed = new Array<PublicationInfo>();
              listPublicationsDto.forEach((publicationDto : any) => {
                let usersofCreation: PublicUser[] = new Array<PublicUser>();
                let creationArray: any[] = (publicationDto.creations);
                //per ogni utente nella lista degli utenti inserisco le informazioni all'interno di una lista temporanea
                //della pubblicazione
                creationArray.forEach((userCreation: any) => {
                  let index = this.listUsers.findIndex(object => {
                    return object.id == userCreation.user;
                  })
                  usersofCreation.push(usersList[index]);
                })

                //creo il feed
                this.listFeed.push(new PublicationInfo(publicationDto, usersofCreation));
              })

              //ho le informazioni degli utenti in this.listUsers
              //ho le informazioni delle pubblicazioni in listPublicationsDto

              //chiamo il serviceInteractions che mi restituisce i like e commenti di tutti i post
              this.callServiceInteractions();

              //alla fine avrò una lista di Post
              console.log(this.listFeed);
            },
            (error) => {
              utility.onError(error, this.eventBusService);
            }
          )
        },
        (error) => {
          utility.onError(error, this.eventBusService);
        }
      )
    } else {
      this.feedService.getPublicFeed(0).subscribe(
        (listPublicationsDto) => {
          //creo la lista degli ID pubblicazioni
          this.listPublicationsID = this.buildPublicationsID(listPublicationsDto);
          //creo la lista degli ID utenti
          this.listUsersID = utility.buildUsersIDfromPublication(listPublicationsDto);

          //chiamo il servizio utenti per avere le informazioni sui creator
          this.feedService.getListofUser(this.listUsersID).subscribe(
            (usersList: PublicUser[]) => {
              //ho la lista di tutti gli utenti del feed
              this.listUsers = new Array<PublicUser>();
              usersList.forEach((element) => {
                this.listUsers.push(new PublicUser(element));
              })
              //per ogni pubblicazione prendo la lista degli utenti
              this.listFeed = new Array<PublicationInfo>();
              listPublicationsDto.forEach((publicationDto: any) => {
                let usersofCreation: PublicUser[] = new Array<PublicUser>();

                let creationArray: any[] = (publicationDto.creations);
                //per ogni utente nella lista degli utenti inserisco le informazioni all'interno di una lista temporanea
                //della pubblicazione
                creationArray.forEach((userCreation: any) => {
                  let index = this.listUsers.findIndex(object => {
                    return object.id == userCreation.user;
                  })
                  usersofCreation.push(usersList[index]);
                })

                //creo il feed
                this.listFeed.push(new PublicationInfo(publicationDto, usersofCreation));
              })

              //ho le informazioni degli utenti in this.listUsers
              //ho le informazioni delle pubblicazioni in listPublicationsDto

              //chiamo il serviceInteractions che mi restituisce i like e commenti di tutti i post
              this.callServiceInteractions();

              //alla fine avrò una lista di Post
              console.log(this.listFeed);
            },
            (error) => {
              utility.onError(error, this.eventBusService);
            }
          )
        },
        (error) => {
          utility.onError(error, this.eventBusService);
        }
      )
    }
  }


  //costruisce la lista di id pubblicazioni da mandare al servizio interazioni
  private buildPublicationsID(list: any[]): any[] {
    if (list == undefined) return [];

    let tmp: any[] = [];
    list.forEach((element) => {
      tmp.push(element.id);
    })
    return tmp;
  }

  /*
    private callServiceUsers() {
      this.feedService.getListofUser(this.listUsersID).subscribe(
        (usersList) => {
          console.log(usersList);
          this.listUsers = usersList; },
        (error) => { this.onError(error); }
      )
    }
  */

  //esegue le chiamate al servizio interazioni per ricevere i likes e i commenti di tutte le pubblicazioni
  private callServiceInteractions() {
    this.feedService.getLikesList(this.listPublicationsID).subscribe(
      (likesList) => {
        this.listFeed.forEach((feedHome) => {
          feedHome.setLikes(likesList[feedHome.getInfoPost().id]);
        })
      },
      (error) => {
        utility.onError(error, this.eventBusService);
      }
    )
    this.feedService.getCommentsList(this.listPublicationsID).subscribe(
      (commentList) => {
        this.listFeed.forEach((feedHome) => {
          feedHome.setListComments(commentList[feedHome.getInfoPost().id]);
        })
      },
      (error) => {
        utility.onError(error, this.eventBusService);
      }
    )
  }

  //restituisce un oggetto PublicUser con le informazioni di un utente
  //il metodo richiede il PublicUser e la lista di PublicUser in cui cercare
  getUser(userParam: PublicUser): PublicUser {
    return utility.getUser(userParam, this.listUsers);
  }

  //restituisce un oggetto PublicCreator con le informazioni dell'utente creator
  //il metodo richiede il PublicUser e la lista di utenti in cui cercare
  getCreator(userParam: PublicUser): PublicCreator {
    return utility.getCreator(userParam, this.listUsers);
  }
}
