export interface SocialLink {
  platform: string;
  url: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
  expertise: string[];
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

export interface EventSeries {
  seriesName: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: Location;
  speakers: Speaker[];
  sections: EventSection[];
  eventSeries?: EventSeries;
  images: string[];
  category: string;
  tags: string[];
  capacity?: number;
  currentAttendees?: number;
  price?: number;
  organizer?: string;
  website: string[];
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}
