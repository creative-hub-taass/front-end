import {Artwork} from "./Artwork";
import {Currency} from "./Enum";

export class Order {
  readonly id!: string;
  readonly idArtwork!: string;
  readonly idUser!: string;
  readonly importo!: number | undefined;
  readonly currency: Currency | undefined;
  readonly destinationAddress!: string;
  readonly timeStamp!: string;

  constructor(artwork: Artwork, userID: any, destinationAddress: string) {
    this.idArtwork = artwork.id;
    this.idUser = userID;
    this.importo = artwork.price;
    this.currency = artwork.currency;
    this.destinationAddress = destinationAddress;
    this.timeStamp = new Date().toISOString();
  }
}
