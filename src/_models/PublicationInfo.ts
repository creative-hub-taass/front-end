import {Artwork} from "./Artwork";
import {PublicUser} from "./PublicUser";
import {Event} from "./Event";
import {Post} from "./Post";

export interface Comment {
  readonly id: string;
  readonly userId: string;
  readonly publicationId: string;
  readonly message: string;
}

export class PublicationInfo {
  readonly publication: Artwork | Event | Post;
  readonly creators: PublicUser[];
  private likes: number = 0;
  private comments: Comment[] = [];

  constructor(dto: any, users: PublicUser[]) {
    this.publication = PublicationInfo.parseDto(dto);
    this.creators = users;
  }

  private static parseDto(dto: any): Artwork | Event | Post {
    if ("creationDateTime" in dto) {
      return new Artwork(dto);
    } else if ("startDateTime" in dto) {
      return new Event(dto);
    } else {
      return new Post(dto);
    }
  }

  public setLikes(likes: number) {
    this.likes = likes;
  }

  public setListComments(list: any[]) {
    this.comments = list;
  }

  public getLikes() {
    return this.likes;
  }

  public getComments() {
    return this.comments;
  }

  public getCreators() {
    return this.creators;
  }

  public getUser(index: number): PublicUser {
    return this.creators[index];
  }

  public equals(idPublication: string): boolean {
    return this.publication.id == idPublication;
  }
}
