import {EventData} from "./event";
import {EventBusService} from "./event-bus.service";
import {PublicUser} from "../_models/PublicUser";
import {PublicCreator} from "../_models/PublicCreator";

//restituisce un errore in console;
//nel caso sia errore http 403, manda evento di logout
export function onError(error: any, eventBusService: EventBusService): void {
  let message = error.error.message || error.error || error.message;
  if (message.status == 403) eventBusService.emit(new EventData('logout', null));
  console.log(message.toString());
}

//costruisce la lista di id utente da mandare al servizio utenti (campo creation di PublicUserDto)
export function buildUsersIDfromPublication(list: any[]): any[] {
  let tmp: any[] = [];
  list.forEach((PublicationDto) => {
    let creationsDto: any[] = PublicationDto.creations;
    creationsDto.forEach((userDto) => {
      if (!tmp.includes(userDto.user)) tmp.push(userDto.user);
    })
  })
  return tmp;
}

export function buildUsersIDfromArtwork(list: any[]): any[] {
  let tmp: any[] = []
  list.forEach((userDto) => {
    if(!tmp.includes(userDto.user)) tmp.push(userDto.user);
  })
  return tmp;
}

//restituisce un oggetto PublicUser con le informazioni di un utente
//il metodo richiede il PublicUser e la lista di PublicUser in cui cercare
export function getUser(userParam: PublicUser, listUsers: PublicUser[]): PublicUser {
  let tmp = new PublicUser(userParam);
  let index = listUsers.findIndex((Object) => {
    return Object.getId() == tmp.getId();
  });
  return listUsers[index];
}

//restituisce un oggetto PublicCreator con le informazioni dell'utente creator
//il metodo richiede il PublicUser e la lista di utenti in cui cercare
export function getCreator(userParam: PublicUser, listUsers: PublicUser[]): PublicCreator {
  let tmp = new PublicUser(userParam);
  let index = listUsers.findIndex((Object) => {
    return Object.getId() == tmp.getId()
  });
  return new PublicCreator(listUsers[index].getCreator());
}
