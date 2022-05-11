import {Creation, Publication} from "./Publication";

export class Post implements Publication {
  readonly publicationType = "post" as const;
  readonly id: string;
  readonly timestamp: string;
  readonly lastUpdate: string;
  readonly creations: Creation[];
  readonly title: string;
  readonly body: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date(dto.timestamp).toISOString();
    this.lastUpdate = new Date(dto.lastUpdate).toISOString();
    this.creations = dto.creations;
    this.title = dto.title;
    this.body = dto.body;
  }
}
