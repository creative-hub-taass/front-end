export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP"
}

export enum CreationType {
  AUTHOR = "AUTHOR",
  COAUTHOR = "COAUTHOR",
  FEATURING = "FEATURING",
  COLLAB = "COLLAB", // Artworks and Posts
  ORGANIZER = "ORGANIZER",
  PARTICIPANT = "PARTICIPANT", // Events
  OTHER = "OTHER"
}

export enum CollaborationRequestStatus {
  OPEN, CLOSED
}
export enum CollaborationRequestCategory{
  MUSICAL
}

export enum CreatorType {
  ARTIST, PAINTER, ILLUSTRATOR, DESIGNER,
  GRAPHIC_DESIGNER, PHOTOGRAPHER, VIDEO_MAKER,
  POET, WRITER,
  MUSICIAN, DANCER
}
export enum UpgradeRequestStatus {
  OPEN, ACCEPTED, REJECTED
}

export function getListCurrency(): string[] {
  return ["USD","EUR","GBP"];
}
export  function  getListCreationTypeAP(): CreationType[] {
  return [CreationType.AUTHOR,CreationType.COAUTHOR,CreationType.FEATURING,CreationType.COLLAB,CreationType.OTHER];
}

export function getListCreationTypeE(): string[] {
  return ["ORGANIZER","PARTICIPANT"];
}

export function getListCollaborationStatus(): string[] {
  return ["OPEN","CLOSED"];
}

export function getListCategory(): string[] {
  return ["MUSICAL"];
}

export function getListUpgradeStatus(): string[] {
  return ["OPEN", "ACCEPTED", "REJECTED"];
}

export function getListCreatorType(): string[] {
  return ["ARTIST","PAINTER","ILLUSTRATOR","DESIGNER","GRAPHIC_DESIGNER","PHOTOGRAPHER","VIDEO_MAKER","POET","WRITER","MUSICIAN","DANCER"];
}
