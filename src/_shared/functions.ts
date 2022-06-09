import {EventData} from "./event";
import {EventBusService} from "./event-bus.service";
import {PublicUser} from "../_models/PublicUser";
import {PublicCreator} from "../_models/PublicCreator";
import {PublicationInfo} from "../_models/PublicationInfo";
import {CreatorService} from "../app/_services/creator.service";
import {TokenStorageService} from "../app/_services/token-storage.service";


//restituisce un errore in console;
//nel caso sia errore http 403, manda evento di logout
export function onError(error: any, eventBusService: EventBusService): string {
  let message = error.error.message || error.error || error.message;
  console.log(message);
  if (message.status == 403 || message.status == 401) eventBusService.emit(new EventData("logout", null));
  console.log(message);
  return message.error;
}


export function buildUsersIDfromSpecificType(list: any[]): any[] {
  let tmp: any[] = [];
  list.forEach((userDto) => {
    if (!tmp.includes(userDto.user)) tmp.push(userDto.user);
  });
  return tmp;
}

export function refreshDate(userId: string | null, thisUser: PublicUser,
                            tokenStorageService: TokenStorageService,
                            eventBusService: EventBusService,
                            creatorService: CreatorService,
                            errorMessage: string): void {
  if (userId == null) return;
  creatorService.getCreator(userId).subscribe({
    next: (user: PublicUser) => {
      thisUser = new PublicUser(user);
      thisUser.creator = new PublicCreator(user.creator);
      window.sessionStorage.setItem(userId, JSON.stringify(user));
      window.location.reload();
    },
    error: (error) => {
      errorMessage = onError(error, eventBusService);
    }
  });
}

export function followCreator(tokenStorageService: TokenStorageService,
                              creatorService: CreatorService,
                              eventBusService: EventBusService,
                              thisUser: PublicUser,
                              errorMessage: string): void {
  if (tokenStorageService.getUser().id == undefined) {
    window.location.replace("/login");
    return;
  }
  creatorService.setFollower(tokenStorageService.getUser().id, thisUser.id).subscribe({
    next: (publicUser: PublicUser) => {
      tokenStorageService.saveUser(publicUser);
      thisUser.fanIds.push(tokenStorageService.getUser().id);
      window.sessionStorage.setItem(thisUser.id, JSON.stringify(thisUser));
      window.location.reload();
    },
    error: (error) => {
      errorMessage = onError(error, eventBusService);
    }
  });
}

export function unfollowCreator(tokenStorageService: TokenStorageService,
                                creatorService: CreatorService,
                                eventBusService: EventBusService,
                                userCreator: PublicUser,
                                errorMessage: string): void {
  if (tokenStorageService.getUser().id == undefined) {
    window.location.replace("/login");
    return;
  }
  creatorService.deleteFollower(tokenStorageService.getUser().id, userCreator.id).subscribe({
    next: (publicUser: PublicUser) => {
      let myUser: PublicUser = publicUser;
      tokenStorageService.saveUser(myUser);

      let index: number = userCreator.fanIds.findIndex((fan) => {
        return fan == myUser.id;
      });
      if (index == -1) return;
      userCreator.fanIds.splice(index, 1);
      window.sessionStorage.setItem(userCreator.id, JSON.stringify(userCreator));
      window.location.reload();
    },
    error: (error) => {
      errorMessage = onError(error, eventBusService);
    }
  });
}

export function callServiceInteractions(listPublicationsID: string[],
                                        creatorService: CreatorService,
                                        listPublicationInfo: PublicationInfo[],
                                        eventBusService: EventBusService,
                                        errorMessage: string): void {
  creatorService.getLikesList(listPublicationsID).subscribe({
    next: (likesList) => {
      listPublicationInfo.forEach((elementPublication) => {
        elementPublication.setLikes(likesList[elementPublication.publication.id]);
      });
    },
    error: (error) => {
      errorMessage = onError(error, eventBusService);
    }
  });
  creatorService.getCommentsList(listPublicationsID).subscribe({
    next: (commentList) => {
      listPublicationInfo.forEach((elementPublication) => {
        elementPublication.setListComments(commentList[elementPublication.publication.id]);
      });
    },
    error: (error) => {
      errorMessage = onError(error, eventBusService);
    }
  });
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
