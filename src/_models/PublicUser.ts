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

  public setId(id: string): void {
    this.id = id;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public setNickname(nickname: string): void {
    this.nickname = nickname;
  }

  public setCreator(creator: PublicCreator): void {
    this.creator = creator;
  }

  public setInspirers(inspirers: string[]): void {
    this.inspirerIds = inspirers;
  }

  public setFan(fans: string[]): void {
    this.fanIds = fans;
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
    return this.getCreator();
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
