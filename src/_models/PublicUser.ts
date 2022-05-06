import {PublicCreator} from "./PublicCreator";

export class PublicUser {
  readonly id: string;
  readonly username: string;
  readonly nickname: string;
  readonly creator: PublicCreator;
  readonly inspirerIds: string[];
  readonly fanIds: string[];

  constructor(publicUserDto: any) {
    this.id = publicUserDto.id;
    this.username = publicUserDto.username;
    this.nickname = publicUserDto.nickname;
    this.creator = publicUserDto.creator;
    this.inspirerIds = publicUserDto.inspirerIds;
    this.fanIds = publicUserDto.fanIds;
  }

  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getCreator(): PublicCreator {
    return this.creator;
  }

  public getInspirer(): string[] {
    return this.inspirerIds;
  }

  public getFan(): string[] {
    return this.fanIds;
  }

  public equals(idUser: string): boolean {
    return this.id == idUser;
  }
}
