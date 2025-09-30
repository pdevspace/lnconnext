/**
 * Backend Event Models
 * Database-specific interfaces and validation schemas
 */

export interface Event {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  eventSeriesName?: string;
  location?: Location;
  sections: EventSection[];
  startDate: Date;
  endDate?: Date;
  bitcoiners: Bitcoiner[];
  images: string[];
  websites: Website[];
  price: number;
  register?: Website;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  buildingName: string;
  address: string;
  city: string;
  country: string;
  googleMapsUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSection {
  id: string;
  sectionName: string;
  startTime: Date;
  endTime: Date;
  spot: string;
  description?: string;
  bitcoiners: Bitcoiner[];
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bitcoiner {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  isActive: boolean;
  socialMedia: SocialMedia[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Website {
  id: string;
  url: string;
  type: 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'other';
  displayText?: string;
  eventId?: string;
  registerEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  id: string;
  displayText: string;
  username: string;
  platform: string;
  urlLink: string;
  ownerId: string;
  ownerType: 'bitcoiner' | 'organizer';
  createdAt: Date;
  updatedAt: Date;
}

// Form data interfaces for API requests
export interface EventFormData {
  name: string;
  description: string;
  eventSeriesName?: string;
  startDate: Date;
  endDate?: Date;
  price: number;
  images: string[];
  organizerId: string;
  locationId?: string;
  speakerIds: string[];
  websiteIds: string[];
  registerId?: string;
}

export interface EventFilters {
  search?: string;
  type?: 'meetup' | 'conference' | 'course';
  status?: 'upcoming' | 'past' | 'live';
  organizerId?: string;
  speakerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

// API response interfaces
export interface EventApiResponse {
  success: boolean;
  data?: Event;
  error?: string;
  message?: string;
}

export interface EventListApiResponse {
  success: boolean;
  data?: Event[];
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
