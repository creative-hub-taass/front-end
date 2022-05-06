import {Artwork} from "./Artwork";
import {PublicUser} from "./PublicUser";
import {Publication} from "./Publication";
import {Event} from "./Event";
import {Post} from "./Post";


export class PublicationInfo {
  readonly publication: Publication;
  readonly creators: PublicUser[];
  private likes: number = 0;
  private comments: any[] = [];

  constructor(dto: any, users: any[]) {
    this.publication = PublicationInfo.parseDto(dto);
    this.creators = users;
  }

  private static parseDto(dto: any): Publication {
    if ("creationDateTime" in dto) {
      return new Artwork(dto);
    } else if ("startDateTime" in dto) {
      return new Event(dto);
    } else {
      return new Post(dto);
    }
  }

  public setLikes(likes: number): void {
    this.likes = likes;
  }

  public setListComments(list: any[]): void {
    this.comments = list;
  }

  public getLikes(): number {
    return this.likes;
  }

  public getComments(): any[] {
    return this.comments;
  }

  public getInfoPost(): any {
    return this.publication;
  }

  public getUsers(): PublicUser[] {
    return this.creators;
  }

  public getUser(index: number): PublicUser {
    return this.creators[index];
  }

  public equals(idPublication: string): boolean {
    return this.publication.id == idPublication;
  }
}
