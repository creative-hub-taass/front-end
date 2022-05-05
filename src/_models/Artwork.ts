import {Creation, Publication} from "./Publication";

export type Attributes = {
  [key: string]: string | undefined;
};

export class Artwork implements Publication {
  readonly publicationType = "artwork" as const;
  readonly id: string;
  readonly timestamp: Date;
  readonly lastUpdate: Date;
  readonly creations: Creation[];
  readonly attributes: Attributes;
  readonly availableCopies: number;
  readonly copies: number;
  readonly creationDateTime: Date;
  readonly currency?: string;
  readonly description: string;
  readonly images: string[];
  readonly name: string;
  readonly onSale: boolean;
  readonly paymentEmail?: string;
  readonly price?: number;
  readonly type: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date(dto.timestamp);
    this.lastUpdate = new Date(dto.lastUpdate);
    this.creations = dto.creations;
    this.attributes = dto.attributes;
    this.availableCopies = dto.availableCopies;
    this.copies = dto.copies;
    this.creationDateTime = new Date(dto.creationDateTime);
    this.currency = dto.currency;
    this.description = dto.description;
    this.images = dto.images;
    this.name = dto.name;
    this.onSale = dto.onSale;
    this.paymentEmail = dto.paymentEmail;
    this.price = dto.price;
    this.type = dto.type;
  }
}
