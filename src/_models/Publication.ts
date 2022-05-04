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

  public setAttributes(attributes: any[]): void {
    this.attributes = attributes;
  }

  public setAvailablecopies(availableCopies: number): void {
    this.availableCopies = availableCopies;
  }

  public setCopies(copies: number): void {
    this.copies = copies;
  }

  public setCreationdatetime(creationDatetime: Date): void {
    this.creationDateTime = creationDatetime;
  }

  public setCreations(creations: any[]): void {
    this.creations = creations;
  }

  public setCurrency(currency: string): void {
    this.currency = currency;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setImages(images: string[]): void {
    this.images = images;
  }

  public setLastupdate(lastUpdate: Date): void {
    this.lastUpdate = lastUpdate;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setOnsale(onSale: boolean): void {
    this.onSale = onSale;
  }

  public setPaymentemail(paymentEmail: string): void {
    this.paymentEmail = paymentEmail;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setTime(time: number): void {
    this.time = time;
  }

  public setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp;
  }

  public setType(type: string): void {
    this.type = type;
  }

  public getAttributes(): any[] {
    return this.attributes;
  }

  public getAvailablecopies(): number {
    return this.availableCopies;
  }

  public getCopies(): number {
    return this.copies;
  }

  public getCreationdatetime(): Date {
    return this.creationDateTime;
  }

  public getCreations(): any[] {
    return this.creations;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getDescription(): string {
    return this.description;
  }

  public getId(): string {
    return this.id;
  }

  public getImages(): string[] {
    return this.images;
  }

  public getLastupdate(): Date {
    return this.lastUpdate;
  }

  public getName(): string {
    return this.name;
  }

  public getOnsale(): boolean {
    return this.onSale;
  }

  public getPaymentemail(): string {
    return this.paymentEmail;
  }

  public getPrice(): number {
    return this.price;
  }

  public getTime(): number {
    return this.time;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getType(): string {
    return this.type;
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
