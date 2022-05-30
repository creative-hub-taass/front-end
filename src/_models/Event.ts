import {Creation, Publication} from "./Publication";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export class Event implements Publication {
  publicationType = "event" as const;
  id: string;
  timestamp: string;
  lastUpdate: string;
  creations: Creation[];
  name: string;
  description: string;
  image: string;
  locationName: string;
  coordinates: Coordinates;
  startDateTime: string;
  endDateTime: string;
  bookingURL?: string | null;

  constructor(dto: any) {
    this.id = dto.id;
    this.timestamp = new Date((dto.timestamp)).toISOString();
    this.lastUpdate = new Date(dto.lastUpdate).toISOString();
    this.creations = dto.creations;
    this.name = dto.name;
    this.description = dto.description;
    this.image = dto.image;
    this.locationName = dto.locationName;
    this.coordinates = dto.coordinates;
    this.startDateTime = new Date(dto.startDateTime).toISOString();
    this.endDateTime = new Date(dto.endDateTime).toISOString();
    this.bookingURL = dto.bookingURL;
  }
}
