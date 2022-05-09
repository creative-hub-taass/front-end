import {Creation, Publication} from "./Publication";

export type Attributes = {
  [key: string]: string | undefined;
};

export class Artwork implements Publication {
  publicationType = "artwork" as const;
  id: string;
  timestamp: Date;
  lastUpdate: Date;
  creations: Creation[];
  attributes: Attributes;
  availableCopies: number;
  copies: number;
  creationDateTime: Date;
  currency?: string;
  description: string;
  images: string[];
  name: string;
  onSale: boolean;
  paymentEmail?: string;
  price?: number;
  type: string;

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
