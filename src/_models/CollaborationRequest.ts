import {CollaborationRequestStatus} from "./Enum";

export class CollaborationRequest {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  description: string;
  timestamp: string;
  contact: string;
  category: string;
  status: CollaborationRequestStatus;

  constructor(dto: any) {
    this.id = dto.id;
    this.senderId = dto.senderId;
    this.receiverId = dto.receiverId;
    this.title = dto.title;
    this.description = dto.description;
    this.timestamp = dto.timestamp;
    this.contact = dto.contact;
    this.category = dto.category;
    this.status = dto.status;
  }
}

