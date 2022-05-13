import {EventData} from "./event";
import {EventBusService} from "./event-bus.service";
import {PublicUser} from "../_models/PublicUser";
import {PublicCreator} from "../_models/PublicCreator";
import {PublicationService} from "../app/_services/publication.service";
import {Comment} from "../_models/PublicationInfo";

//restituisce un errore in console;
//nel caso sia errore http 403, manda evento di logout
export function onError(error: any, eventBusService: EventBusService): string {
  let message = error.error.message || error.error || error.message;
  console.log(message);
  if (message.status == 403 || message.status == 401) eventBusService.emit(new EventData("logout", null));
  console.log(message);
  return message;
}

//costruisce la lista di id utente da mandare al servizio utenti (campo creation di PublicUserDto)
export function buildUsersIDfromPublication(list: any[]): any[] {
  let tmp: any[] = [];
  list.forEach((PublicationDto) => {
    let creationsDto: any[] = PublicationDto.creations;
    creationsDto.forEach((userDto) => {
      if (!tmp.includes(userDto.user)) tmp.push(userDto.user);
    });
  });
  return tmp;
}

export function buildUsersIDfromSpecificType(list: any[]): any[] {
  let tmp: any[] = [];
  list.forEach((userDto) => {
    if (!tmp.includes(userDto.user)) tmp.push(userDto.user);
  });
  return tmp;
}

//restituisce un oggetto PublicUser con le informazioni di un utente
//il metodo richiede il PublicUser e la lista di PublicUser in cui cercare
export function getUser(userParam: PublicUser, listUsers: PublicUser[]): PublicUser {
  let tmp = new PublicUser(userParam);
  let index = listUsers.findIndex((Object) => {
    return Object.id == tmp.id;
  });
  return listUsers[index];
}

//restituisce un oggetto PublicCreator con le informazioni dell'utente creator
//il metodo richiede il PublicUser e la lista di utenti in cui cercare
export function getCreator(userParam: PublicUser, listUsers: PublicUser[]): PublicCreator {
  let tmp = new PublicUser(userParam);
  let index = listUsers.findIndex((Object) => {
    return Object.getId() == tmp.getId();
  });
  return new PublicCreator(listUsers[index].getCreator());
}

export function callServiceInteractions(artworkId: string, publicationService: PublicationService, eventBusService: EventBusService, countLikes: number, listComments: Comment[]){
  if(artworkId!=null) {
    publicationService.getLikes(artworkId).subscribe(
      (likesCount) => {
        countLikes = likesCount;
      },
      (error) => { onError(error, eventBusService); }
    );
    publicationService.getComments(artworkId).subscribe(
      (comments: Comment[]) => {
        listComments = comments;
      },
      (error) => { onError(error, eventBusService); }
    );
  }
}
