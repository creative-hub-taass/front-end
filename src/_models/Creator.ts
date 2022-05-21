import {CreatorType} from "./Enum";

export class Creator {
  id: string;
  name: string;
  surname: string;
  birthDate: string;
  bio: string;
  creatorType: CreatorType;
  avatar: string;
  paymentEmail: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.name = dto.name;
    this.surname = dto.surname;
    this.birthDate = dto.birthDate;
    this.bio = dto.bio;
    this.creatorType = dto.creatorType;
    this.avatar = dto.avatar;
    this.paymentEmail = dto.paymentEmail;
  }
}
