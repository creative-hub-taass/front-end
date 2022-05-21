import {Creator} from "./Creator";

export class User{
  id: string;
  username: string;
  nickname: string;
  email: string;
  role: string;
  creator: Creator;
  inspirerIds: string[];
  fanIds: string[];

  constructor(dto: any) {
    this.id = dto.id;
    this.username = dto.username;
    this.nickname = dto.nickname;
    this.email = dto.email;
    this.role= dto.role;
    this.creator = dto.creator;
    this.inspirerIds = dto.inspirerIds;
    this.fanIds = dto.fanIds;
  }
}
