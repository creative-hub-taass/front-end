
export class Donation {
  readonly id: string;
  readonly idSender: string;
  readonly idCreator: string;
  readonly importo: number;
  readonly message: string;
  readonly currency: string;
  readonly timestamp: string;

  constructor(dto: any) {
    this.id = "";
    this.idSender = dto.idSender;
    this.idCreator = dto.idCreator;
    this.importo = dto.importo;
    this.message = dto.message;
    this.currency = dto.currency;
    this.timestamp = new Date().toISOString();
  }
}
