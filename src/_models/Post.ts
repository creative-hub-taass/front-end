import {Publication} from "./Publication";
import {PublicUser} from "./PublicUser";

export class Post {

  private likes! : number;
  private listComments!: any[];
  private infoPost! : Publication;
  private infoUser! : PublicUser[];

  constructor(info: any, users: any[]) {
      this.infoPost = new Publication(info);
      this.infoUser = users;
  }

  public setInfo(info: any): void {
    this.infoPost = new Publication(info);
  }

  public setUsers(users: any): void {
    this.infoUser = users;
  }

  public setLikes(nrLikes: number): void {
    this.likes = nrLikes;
  }

  public setListComments(list: any[]): void {
    this.listComments = list;
  }

  public getLikes(): number {
    return this.likes;
  }

  public getComments(): any[] {
    return this.listComments;
  }

  public getInfoPost(): any {
    return this.infoPost;
  }


  public equals(idPublication: string): boolean {
    return this.infoPost.getId() == idPublication;
  }


}
