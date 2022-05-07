import {Artwork} from "./Artwork";

export class Order {
  readonly id!: string;
  readonly idArtwork!: string;
  readonly idUser!: string;
  readonly importo!: number | undefined;
  readonly destinationAddress!: string;
  readonly timeStamp!: number;

  constructor(artwork: Artwork, userID: any, destinationAddress: string) {
    this.idArtwork = artwork.id;
    this.idUser = userID;
    this.importo = artwork.price;
    this.destinationAddress = destinationAddress;
    this.timeStamp = new Date().getTime();
  }
}
