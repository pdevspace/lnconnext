/**
 * Organizer Service
 * Business logic for organizer management
 */

import { prisma } from '@/prisma/prisma';
import { Organizer, OrganizerFilters, OrganizerStats, Event } from '@/models/organizer';
import { SocialMedia } from '@/models/event';

export class OrganizerService {
  // Get organizer by ID with all related data
  static async getOrganizerById(organizerId: string): Promise<Organizer | null> {
    try {
      const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
        include: {
          events: {
            orderBy: { startDate: 'desc' }
          }
        }
      });

      if (!organizer) {
        return null;
      }

      // Get social media for organizer
      const socialMedia = await prisma.socialMedia.findMany({
        where: {
          ownerId: organizerId,
          ownerType: 'organizer'
        }
      });

      return {
        ...organizer,
        bio: organizer.bio || undefined,
        avatar: organizer.avatar || undefined,
        website: organizer.website || undefined,
        events: organizer.events.map(event => ({
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate || undefined,
          organizerId: event.organizerId
        })),
        socialMedia: socialMedia.map(sm => ({
          id: sm.id,
          displayText: sm.displayText,
          username: sm.username,
          platform: sm.platform,
          urlLink: sm.urlLink,
          ownerId: sm.ownerId,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
          createdAt: sm.createdAt,
          updatedAt: sm.updatedAt
        }))
      };
    } catch (error) {
      console.error('Error fetching organizer:', error);
      throw new Error('Failed to fetch organizer');
    }
  }

  // Get all organizers with filtering and pagination
  static async getAllOrganizers(filters: OrganizerFilters = {}): Promise<Organizer[]> {
    try {
      const where: any = {};

      if (filters.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const organizers = await prisma.organizer.findMany({
        where,
        include: {
          events: {
            orderBy: { startDate: 'desc' }
          }
        },
        take: filters.limit || 50,
        skip: filters.offset || 0,
        orderBy: { name: 'asc' }
      });

      // Get social media for each organizer
      const organizersWithSocialMedia = await Promise.all(
        organizers.map(async (organizer) => {
          const socialMedia = await prisma.socialMedia.findMany({
            where: {
              ownerId: organizer.id,
              ownerType: 'organizer'
            }
          });

          return {
            ...organizer,
            bio: organizer.bio || undefined,
            avatar: organizer.avatar || undefined,
            website: organizer.website || undefined,
            events: organizer.events.map(event => ({
              id: event.id,
              name: event.name,
              description: event.description,
              startDate: event.startDate,
              endDate: event.endDate || undefined,
              organizerId: event.organizerId
            })),
            socialMedia: socialMedia.map(sm => ({
              id: sm.id,
              displayText: sm.displayText,
              username: sm.username,
              platform: sm.platform,
              urlLink: sm.urlLink,
              ownerId: sm.ownerId,
              ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
              createdAt: sm.createdAt,
              updatedAt: sm.updatedAt
            }))
          };
        })
      );

      return organizersWithSocialMedia;
    } catch (error) {
      console.error('Error fetching organizers:', error);
      throw new Error('Failed to fetch organizers');
    }
  }

  // Get events by organizer
  static async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    try {
      const events = await prisma.event.findMany({
        where: { organizerId },
        orderBy: { startDate: 'desc' }
      });

      return events.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate || undefined,
        organizerId: event.organizerId
      }));
    } catch (error) {
      console.error('Error fetching organizer events:', error);
      throw new Error('Failed to fetch organizer events');
    }
  }

  // Search organizers by query
  static async searchOrganizers(query: string): Promise<Organizer[]> {
    try {
      const organizers = await prisma.organizer.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        include: {
          events: {
            orderBy: { startDate: 'desc' }
          }
        },
        orderBy: { name: 'asc' }
      });

      // Get social media for each organizer
      const organizersWithSocialMedia = await Promise.all(
        organizers.map(async (organizer) => {
          const socialMedia = await prisma.socialMedia.findMany({
            where: {
              ownerId: organizer.id,
              ownerType: 'organizer'
            }
          });

          return {
            ...organizer,
            bio: organizer.bio || undefined,
            avatar: organizer.avatar || undefined,
            website: organizer.website || undefined,
            events: organizer.events.map(event => ({
              id: event.id,
              name: event.name,
              description: event.description,
              startDate: event.startDate,
              endDate: event.endDate || undefined,
              organizerId: event.organizerId
            })),
            socialMedia: socialMedia.map(sm => ({
              id: sm.id,
              displayText: sm.displayText,
              username: sm.username,
              platform: sm.platform,
              urlLink: sm.urlLink,
              ownerId: sm.ownerId,
              ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
              createdAt: sm.createdAt,
              updatedAt: sm.updatedAt
            }))
          };
        })
      );

      return organizersWithSocialMedia;
    } catch (error) {
      console.error('Error searching organizers:', error);
      throw new Error('Failed to search organizers');
    }
  }

  // Get organizer statistics
  static async getOrganizerStats(organizerId: string): Promise<OrganizerStats> {
    try {
      const events = await prisma.event.findMany({
        where: { organizerId },
        orderBy: { startDate: 'desc' }
      });

      const now = new Date();
      const upcomingEvents = events.filter(event => event.startDate > now);
      const pastEvents = events.filter(event => event.startDate <= now);

      // Get recent events (last 5)
      const recentEvents = events.slice(0, 5).map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate || undefined,
        organizerId: event.organizerId
      }));

      return {
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        totalSpeakers: 0, // This would need to be calculated based on event speakers
        recentEvents
      };
    } catch (error) {
      console.error('Error fetching organizer stats:', error);
      throw new Error('Failed to fetch organizer statistics');
    }
  }

  // Create organizer
  static async createOrganizer(data: any): Promise<Organizer> {
    try {
      const { socialMediaIds, ...organizerData } = data;

      // Create the organizer
      const newOrganizer = await prisma.organizer.create({
        data: organizerData,
        include: {
          socialMedia: true,
          events: true
        }
      });

      // Handle social media creation if provided
      if (socialMediaIds && Array.isArray(socialMediaIds) && socialMediaIds.length > 0) {
        await prisma.socialMedia.createMany({
          data: socialMediaIds.map((smId: string) => ({
            id: smId,
            ownerId: newOrganizer.id,
            ownerType: 'organizer',
            displayText: '',
            username: '',
            platform: 'other',
            urlLink: ''
          }))
        });
      }

      return {
        ...newOrganizer,
        bio: newOrganizer.bio || undefined,
        avatar: newOrganizer.avatar || undefined,
        website: newOrganizer.website || undefined,
        socialMedia: (newOrganizer.socialMedia || []).map(sm => ({
          ...sm,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer'
        })),
        events: (newOrganizer.events || []).map(event => ({
          ...event,
          endDate: event.endDate || undefined
        }))
      };
    } catch (error) {
      console.error('Error creating organizer:', error);
      throw new Error('Failed to create organizer');
    }
  }

  // Update organizer
  static async updateOrganizer(organizerId: string, data: any): Promise<Organizer | null> {
    try {
      const { socialMediaIds, ...organizerData } = data;

      // Update the organizer
      const updatedOrganizer = await prisma.organizer.update({
        where: { id: organizerId },
        data: organizerData,
        include: {
          socialMedia: true,
          events: true
        }
      });

      // Handle social media updates if provided
      if (socialMediaIds && Array.isArray(socialMediaIds)) {
        // Delete existing social media
        await prisma.socialMedia.deleteMany({
          where: {
            ownerId: organizerId,
            ownerType: 'organizer'
          }
        });

        // Note: Social media creation should be handled separately
        // as we need the actual social media data, not just IDs
      }

      return {
        ...updatedOrganizer,
        bio: updatedOrganizer.bio || undefined,
        avatar: updatedOrganizer.avatar || undefined,
        website: updatedOrganizer.website || undefined,
        socialMedia: (updatedOrganizer.socialMedia || []).map(sm => ({
          ...sm,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer'
        })),
        events: (updatedOrganizer.events || []).map(event => ({
          ...event,
          endDate: event.endDate || undefined
        }))
      };
    } catch (error) {
      console.error('Error updating organizer:', error);
      throw new Error('Failed to update organizer');
    }
  }

  // Delete organizer
  static async deleteOrganizer(organizerId: string): Promise<boolean> {
    try {
      const result = await prisma.organizer.delete({
        where: { id: organizerId }
      });

      return !!result;
    } catch (error) {
      console.error('Error deleting organizer:', error);
      throw new Error('Failed to delete organizer');
    }
  }
}