import {PublicUser} from "./PublicUser";
import {UpgradeRequestStatus} from "./Enum";

export class UpgradeRequest {
  id: string;
  user: PublicUser;
  name: string;
  surname: string;
  bio: string;
  portfolio: string;
  motivationalText: string;
  artName: string;
  birthDate: string;
  username: string;
  avatar: string;
  paymentEmail: string;
  status: UpgradeRequestStatus;
  creatorType: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.user = dto.user;
    this.name = dto.name;
    this.surname = dto.surname;
    this.bio = dto.bio;
    this.portfolio = dto.portfolio;
    this.motivationalText = dto.motivationalText;
    this.artName = dto.artName;
    this.birthDate = dto.birthDate;
    this.username = dto.username;
    this.avatar = dto.avatar;
    this.paymentEmail = dto.paymentEmail;
    this.status = dto.status;
    this.creatorType = dto.creatorType;
  }
}
