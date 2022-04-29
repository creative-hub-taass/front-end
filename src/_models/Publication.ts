
export class Publication {

  private attributes!: any[];
  private availableCopies!: number;
  private copies!: number;
  private creationDateTime!: Date;
  private creations!: any[];
  private currency!: string;
  private description!: string;
  private id!: string;
  private images!: string[];
  private lastUpdate!: Date;
  private name!: string;
  private onSale!: boolean;
  private paymentEmail!: string;
  private price!: number;
  private time!: number;
  private timestamp!: Date;
  private type!: string;


  constructor(infoPost: any) {
    this.attributes = infoPost.attributes;
    this.availableCopies = infoPost.availableCopies;
    this.copies = infoPost.copies;
    this.creationDateTime = new Date(infoPost.creationDateTime);
    this.creations = infoPost.creations;
    this.currency = infoPost.currency
    this.description = infoPost.description;
    this.id = infoPost.id;
    this.images = infoPost.images;
    this.lastUpdate = new Date(infoPost.lastUpdate);
    this.name = infoPost.name;
    this.onSale = infoPost.onSale;
    this.paymentEmail = infoPost.paymentEmail;
    this.price = infoPost.price;
    this.time = infoPost.time;
    this.timestamp = new Date(infoPost.timestamp);
    this.type = infoPost.type;
  }

  getId() : string {
    return this.id;
  }
}
/*    attributes: {size: '45.7 × 47.7 cm', medium: 'Includes etchings; engravings; lithographs; monoprints; screen prints; woodcuts.'}
availableCopies: 40
copies: 40
creationDateTime: "1962-04-28T00:00:00Z"
creations: [{…}]
currency: "GBP"
description: "Available for sale from Meakin + Parsons, Bridget Riley, Untitled [based on Primitive Blaze] (1962), Screenprint in black on paper, 45.7 × 47.7 cm.\nUntitled [based on Primitive Blaze] was initially held back from publication by Bridget RILEY. The artist rediscovered the work decades later and, recognising its importance, published a small edition of 40 prints plus artist's proofs. The tile, given upon release, refers to the painting Primitive Blaze (BR 47), made in 1963, which explores related pictorial movement and forms."
id: "4329afeb-d466-420f-8393-f7533b95fb85"
images: ['https://d32dm0rphc51dk.cloudfront.net/BplxSUPC-KWWit0lvbsVGA/large.jpg']
lastUpdate: "2022-04-28T16:32:28.343174Z"
name: "Untitled [based on Primitive Blaze]"
onSale: true
paymentEmail: "payments@creativehub.com"
price: 8500000
time: -242352000
timestamp: "2022-04-28T16:32:28.343183Z"
type: "Print"*/
