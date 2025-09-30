/**
 * Frontend Organizer Types
 * TypeScript interfaces for organizer-related data
 */

export interface Organizer {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  socialMedia: SocialMedia[];
  events: Event[];
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
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  organizerId: string;
  // ... other event fields
}

export interface OrganizerFilters {
  search?: string;
  isActive?: boolean;
  hasEvents?: boolean;
  limit?: number;
  offset?: number;
}

export interface OrganizerStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalSpeakers: number;
  recentEvents: Event[];
}

export interface OrganizerFormData {
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  socialMediaIds: string[];
}
