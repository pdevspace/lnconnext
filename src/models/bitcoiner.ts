/**
 * Backend Model Interfaces
 * 
 * This file contains the core data interfaces for the bitcoiner feature.
 * These interfaces define the data structures used by the backend service layer
 * and represent the actual data models in the database.
 */

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

export interface BitcoinerFormData {
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  socialMedia: SocialMediaData[];
}

export interface SocialMediaData {
  id?: string;
  displayText: string;
  username: string;
  platform: string;
  urlLink: string;
}

export interface BitcoinerFilters {
  search?: string;
  expertise?: string[];
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface BitcoinerCreateData {
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  socialMedia: Omit<SocialMediaData, 'id'>[];
}

export interface BitcoinerUpdateData {
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  socialMedia: SocialMediaData[];
}