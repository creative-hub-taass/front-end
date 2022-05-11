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

export function getListCurrency() {
  return ["USD","EUR","GBP"];
}
export  function  getListCreationTypeAP() {
  return ["AUTHOR","COAUTHOR","FEATURING","COLLAB","OTHER"];
}

export function getListCreationTypeE() {
  return ["ORGANIZER","PARTICIPANT"];
}
