export interface Event {
  id: string;
  name: string;
  description: string;
  organizer: Organizer;
  eventSeriesName?: string;
  location?: Location;
  sections: EventSection[];
  price: number;

  startDate: Date;
  endDate: Date;
  speakers: Speaker[];
  images: string[];
  website: Website[];
  socialMedia: SocialMedia;
}

export interface Organizer {
  id: string;
  name: string;
  socialMedia: SocialMedia;
  speakers: string[];
}

export interface Location {
  id: string;
  buildingName: string;
  googleMapsUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface EventSection {
  id: string;
  sectionName: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  spot: {
    location: Location;
    name?: string;
    floor?: string;
  };
  speakers: Speaker[];
}

export interface Speaker {
  id: string;
  name: string;
  socialMedia: SocialMedia;
}

export interface Website {
  id: string;
  displayText: string;
  source: "facebook" | "website" | "ticket" | "other";
  sourceUrl: string;
}

export interface SocialMediaEntry {
  username: string;
  platform: "facebook" | "youtube" | "other";
  urlLink: string;
}

export type SocialMedia = Record<string, SocialMediaEntry>;
