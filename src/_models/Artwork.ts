import {Creation, Publication} from "./Publication";
import {Currency} from "./Enum";

export type Attributes = {
  [key: string]: string | undefined;
};

export class Artwork implements Publication {
  publicationType = "artwork" as const;
  id: string;

  timestamp: string;
  lastUpdate: string;
  creations: Creation[];
  attributes: Attributes;
  availableCopies: number;
  copies: number;
  creationDateTime: string;
  currency?: Currency;
  description: string;
  images: string[];
  name: string;
  onSale: boolean;
  paymentEmail?: string;
  price?: number;
  type: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date(dto.timestamp).toISOString();
    this.lastUpdate = new Date(dto.lastUpdate).toISOString();
    this.creations = dto.creations;
    this.attributes = dto.attributes;
    this.availableCopies = dto.availableCopies;
    this.copies = dto.copies;
    this.creationDateTime = new Date(dto.creationDateTime).toISOString();
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
