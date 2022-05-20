export interface Creation {
  id: string;
  user: string;
  creationType: string;
}

export interface Publication {
  publicationType: "artwork" | "event" | "post";
  creations: Creation[];
  id: string;
  lastUpdate: string;
  timestamp: string;
}
