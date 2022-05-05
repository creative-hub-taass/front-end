import {Creation, Publication} from "./Publication";

interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export class Event implements Publication {
  readonly publicationType = "event" as const;
  readonly id: string;
  readonly timestamp: Date;
  readonly lastUpdate: Date;
  readonly creations: Creation[];
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly locationName: string;
  readonly coordinates: Coordinates;
  readonly startDateTime: Date;
  readonly endDateTime: Date;
  readonly bookingURL?: string;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date((dto.timestamp));
    this.lastUpdate = new Date(dto.lastUpdate);
    this.creations = dto.creations;
    this.name = dto.name;
    this.description = dto.description;
    this.image = dto.image;
    this.locationName = dto.locationName;
    this.coordinates = dto.coordinates;
    this.startDateTime = new Date(dto.startDateTime);
    this.endDateTime = new Date(dto.endDateTime);
    this.bookingURL = dto.bookingURL;
  }
}
