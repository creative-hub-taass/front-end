import {Creation, Publication} from "./Publication";

export class Post implements Publication {
  publicationType = "post" as const;
  id: string;
  timestamp: string;
  lastUpdate: string;
  creations: Creation[];
  title: string;
  body: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date(dto.timestamp).toISOString();
    this.lastUpdate = new Date(dto.lastUpdate).toISOString();
    this.creations = dto.creations;
    this.title = dto.title;
    this.body = dto.body;
  }
}
