import {PublicCreator} from "./PublicCreator";

export class PublicUser {
  public id!: string;
  private username!: string;
  private nickname!: string;
  private creator!: PublicCreator;
  private inspirerIds!: string[];
  private fanIds!: string[];



  constructor(publicUserDto: any) {
    this.id = publicUserDto.id;
    this.username = publicUserDto.username;
    this.nickname = publicUserDto.nickname;
    this.creator = publicUserDto.creator;
    this.inspirerIds = publicUserDto.inspirerIds;
    this.fanIds = publicUserDto.fanIds;
  }

  public equals(idUser: string): boolean {
    return this.id == idUser;
  }

}
