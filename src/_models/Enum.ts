export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  AUD = "AUD",
  CAD = "CAD",
  CHF = "CHF",
  CNH = "CNH",
  SEK = "SEK",
  NZD = "NZD"
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
  OPEN ="OPEN", CLOSED ="CLOSED"
}

export enum CreatorType {
  ARTIST ="ARTIST",
  PAINTER = "PAINTER",
  ILLUSTRATOR = "ILLUSTRATOR",
  DESIGNER = "DESIGNER",
  GRAPHIC_DESIGNER = "GRAPHIC_DESIGNER",
  PHOTOGRAPHER = "PHOTOGRAPHER",
  VIDEO_MAKER = "VIDEO_MAKER",
  POET = "POET",
  WRITER = "WRITER",
  MUSICIAN = "MUSICIAN",
  DANCER = "DANCER"
}
export enum UpgradeRequestStatus {
  OPEN = "OPEN", ACCEPTED = "ACCEPTED", REJECTED = "REJECTED"
}

export function getListCurrency(): Currency[] {
  return [Currency.USD,Currency.EUR,Currency.GBP, Currency.AUD, Currency.CAD, Currency.CHF, Currency.CNH, Currency.JPY, Currency.NZD, Currency.SEK];
}
export  function  getListCreationTypeAP(): CreationType[] {
  return [CreationType.AUTHOR,CreationType.COAUTHOR,CreationType.FEATURING,CreationType.COLLAB,CreationType.OTHER];
}

export function getListCreationTypeE(): CreationType[] {
  return [CreationType.ORGANIZER, CreationType.PARTICIPANT];
}

export function getListCollaborationStatus(): CollaborationRequestStatus[] {
  return [CollaborationRequestStatus.OPEN,CollaborationRequestStatus.CLOSED];
}

export function getListUpgradeStatus(): UpgradeRequestStatus[] {
  return [UpgradeRequestStatus.OPEN,UpgradeRequestStatus.ACCEPTED, UpgradeRequestStatus.REJECTED];
}

export function getListCreatorType(): CreatorType[] {
  return [CreatorType.ARTIST, CreatorType.PAINTER, CreatorType.ILLUSTRATOR, CreatorType.DESIGNER, CreatorType.GRAPHIC_DESIGNER, CreatorType.PHOTOGRAPHER, CreatorType.VIDEO_MAKER, CreatorType.POET, CreatorType.MUSICIAN, CreatorType.DANCER];
}
