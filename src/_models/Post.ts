import {Creation, Publication} from "./Publication";

export class Post implements Publication {
  readonly publicationType = "post" as const;
  readonly id: string;
  readonly timestamp: Date;
  readonly lastUpdate: Date;
  readonly creations: Creation[];
  readonly title: string;
  readonly body: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date(dto.timestamp);
    this.lastUpdate = new Date(dto.lastUpdate);
    this.creations = dto.creations;
    this.title = dto.title;
    this.body = dto.body;
  }
}
