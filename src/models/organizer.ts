/**
 * Backend Organizer Models
 * Database-specific interfaces and validation schemas
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

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  organizerId: string;
  // ... other event fields
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
export interface OrganizerFormData {
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  socialMediaIds: string[];
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

// API response interfaces
export interface OrganizerApiResponse {
  success: boolean;
  data?: Organizer;
  error?: string;
  message?: string;
}

export interface OrganizerListApiResponse {
  success: boolean;
  data?: Organizer[];
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
