
export class PublicCreator {
  private id!: string;
  private bio!: string;
  private creatorType!: string;
  private avatar!: string;

  constructor(id: string, bio: string, creatorType: string, avatar: string) {
    this.id = id;
    this.bio = bio;
    this.creatorType = creatorType;
    this.avatar = avatar;
  }
}
