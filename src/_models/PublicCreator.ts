export class PublicCreator {
  private id!: string;
  private bio!: string;
  private creatorType!: string;
  private avatar!: string;

  constructor(publicCreatorDto: any) {
    this.id = publicCreatorDto.id;
    this.bio = publicCreatorDto.bio;
    this.creatorType = publicCreatorDto.creatorType;
    this.avatar = publicCreatorDto.avatar;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setBio(bio: string): void {
    this.bio = bio;
  }

  public setCreatortype(creatorType: string): void {
    this.creatorType = creatorType;
  }

  public setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  public getId(): string {
    return this.id;
  }

  public getBio(): string {
    return this.bio;
  }

  public getCreatorType(): string {
    return this.creatorType;
  }

  public getAvatar(): string {
    return this.avatar;
  }

}
