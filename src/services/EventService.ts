/**
 * Event Service
 * Business logic for event management
 */

import { prisma } from '@/prisma/prisma';
import { Event, EventFilters } from '@/models/event';
import { Bitcoiner } from '@/models/event';
import { SocialMedia } from '@/models/event';

export class EventService {
  // Get event by ID with all related data
  static async getEventById(eventId: string): Promise<Event | null> {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          location: true,
          organizer: true,
          sections: {
            include: {
              sectionBitcoiners: {
                include: {
                  bitcoiner: true
                }
              }
            }
          },
          eventBitcoiners: {
            include: {
              bitcoiner: true
            }
          },
          websites: true
        }
      });

      if (!event) {
        return null;
      }

      // Get social media for all bitcoiners
      const allBitcoinerIds = [
        ...event.eventBitcoiners.map((eb: any) => eb.bitcoiner.id),
        ...event.sections.flatMap((section: any) => 
          section.sectionBitcoiners.map((sb: any) => sb.bitcoiner.id)
        )
      ];
      
      const uniqueBitcoinerIds = [...new Set(allBitcoinerIds)];
      
      const socialMedia = await prisma.socialMedia.findMany({
        where: {
          ownerId: { in: uniqueBitcoinerIds },
          ownerType: 'bitcoiner'
        }
      });

      // Group social media by bitcoiner
      const socialMediaByBitcoiner = socialMedia.reduce((acc: any, sm: any) => {
        if (!acc[sm.ownerId]) {
          acc[sm.ownerId] = [];
        }
        acc[sm.ownerId].push({
          id: sm.id,
          displayText: sm.displayText,
          username: sm.username,
          platform: sm.platform,
          urlLink: sm.urlLink,
          ownerId: sm.ownerId,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
          createdAt: sm.createdAt,
          updatedAt: sm.updatedAt
        });
        return acc;
      }, {} as Record<string, SocialMedia[]>);

      // Map bitcoiners with social media
      const bitcoinersWithSocialMedia = event.eventBitcoiners.map((eb: any) => ({
        ...eb.bitcoiner,
        socialMedia: socialMediaByBitcoiner[eb.bitcoiner.id] || []
      }));

      // Map sections with bitcoiners
      const sectionsWithBitcoiners = event.sections.map((section: any) => ({
        ...section,
        bitcoiners: section.sectionBitcoiners.map((sb: any) => ({
          ...sb.bitcoiner,
          socialMedia: socialMediaByBitcoiner[sb.bitcoiner.id] || []
        }))
      }));

      return {
        ...event,
        eventSeriesName: event.eventSeriesName || undefined,
        endDate: event.endDate || undefined,
        location: event.location ? {
          id: event.location.id,
          address: event.location.address,
          googleMapsUrl: event.location.googleMapsUrl,
          buildingName: event.location.buildingName,
          city: event.location.city,
          country: event.location.country,
          coordinates: event.location.coordinates as { lat: number; lng: number } | undefined,
          createdAt: event.location.createdAt,
          updatedAt: event.location.updatedAt
        } : undefined,
        bitcoiners: bitcoinersWithSocialMedia,
        sections: sectionsWithBitcoiners,
        websites: event.websites.map(website => ({
          id: website.id,
          url: website.url,
          type: website.type as 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'other',
          displayText: website.displayText || undefined,
          eventId: website.eventId || undefined,
          registerEventId: undefined,
          createdAt: website.createdAt,
          updatedAt: website.updatedAt
        }))
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  // Get events with filtering and pagination
  static async getEvents(filters: EventFilters = {}): Promise<Event[]> {
    try {
      const where: any = {};

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      if (filters.organizerId) {
        where.organizerId = filters.organizerId;
      }

      if (filters.speakerId) {
        where.eventBitcoiners = {
          some: { bitcoinerId: filters.speakerId }
        };
      }

      if (filters.dateFrom) {
        where.startDate = { gte: filters.dateFrom };
      }

      if (filters.dateTo) {
        where.startDate = { lte: filters.dateTo };
      }

      const events = await prisma.event.findMany({
        where,
        include: {
          location: true,
          organizer: true,
          sections: {
            include: {
              sectionBitcoiners: {
                include: {
                  bitcoiner: true
                }
              }
            }
          },
          eventBitcoiners: {
            include: {
              bitcoiner: true
            }
          },
          websites: true
        },
        take: filters.limit || 50,
        skip: filters.offset || 0,
        orderBy: { startDate: 'desc' }
      });

      // Get social media for all bitcoiners
      const allBitcoinerIds = events.flatMap((event: any) => [
        ...event.eventBitcoiners.map((eb: any) => eb.bitcoiner.id),
        ...event.sections.flatMap((section: any) => 
          section.sectionBitcoiners.map((sb: any) => sb.bitcoiner.id)
        )
      ]);
      
      const uniqueBitcoinerIds = [...new Set(allBitcoinerIds)];
      
      const socialMedia = await prisma.socialMedia.findMany({
        where: {
          ownerId: { in: uniqueBitcoinerIds },
          ownerType: 'bitcoiner'
        }
      });

      // Group social media by bitcoiner
      const socialMediaByBitcoiner = socialMedia.reduce((acc: any, sm: any) => {
        if (!acc[sm.ownerId]) {
          acc[sm.ownerId] = [];
        }
        acc[sm.ownerId].push({
          id: sm.id,
          displayText: sm.displayText,
          username: sm.username,
          platform: sm.platform,
          urlLink: sm.urlLink,
          ownerId: sm.ownerId,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
          createdAt: sm.createdAt,
          updatedAt: sm.updatedAt
        });
        return acc;
      }, {} as Record<string, SocialMedia[]>);

      // Map events with social media
      return events.map((event: any) => ({
        ...event,
        bitcoiners: event.eventBitcoiners.map((eb: any) => ({
          ...eb.bitcoiner,
          socialMedia: socialMediaByBitcoiner[eb.bitcoiner.id] || []
        })),
        sections: event.sections.map((section: any) => ({
          ...section,
          bitcoiners: section.sectionBitcoiners.map((sb: any) => ({
            ...sb.bitcoiner,
            socialMedia: socialMediaByBitcoiner[sb.bitcoiner.id] || []
          }))
        }))
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  // Search events by query
  static async searchEvents(query: string, filters: EventFilters = {}): Promise<Event[]> {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (filters.organizerId) {
        where.organizerId = filters.organizerId;
      }

      if (filters.speakerId) {
        where.eventBitcoiners = {
          some: { bitcoinerId: filters.speakerId }
        };
      }

      const events = await prisma.event.findMany({
        where,
        include: {
          location: true,
          organizer: true,
          sections: {
            include: {
              sectionBitcoiners: {
                include: {
                  bitcoiner: true
                }
              }
            }
          },
          eventBitcoiners: {
            include: {
              bitcoiner: true
            }
          },
          websites: true
        },
        take: filters.limit || 50,
        skip: filters.offset || 0,
        orderBy: { startDate: 'desc' }
      });

      // Get social media for all bitcoiners
      const allBitcoinerIds = events.flatMap((event: any) => [
        ...event.eventBitcoiners.map((eb: any) => eb.bitcoiner.id),
        ...event.sections.flatMap((section: any) => 
          section.sectionBitcoiners.map((sb: any) => sb.bitcoiner.id)
        )
      ]);
      
      const uniqueBitcoinerIds = [...new Set(allBitcoinerIds)];
      
      const socialMedia = await prisma.socialMedia.findMany({
        where: {
          ownerId: { in: uniqueBitcoinerIds },
          ownerType: 'bitcoiner'
        }
      });

      // Group social media by bitcoiner
      const socialMediaByBitcoiner = socialMedia.reduce((acc: any, sm: any) => {
        if (!acc[sm.ownerId]) {
          acc[sm.ownerId] = [];
        }
        acc[sm.ownerId].push({
          id: sm.id,
          displayText: sm.displayText,
          username: sm.username,
          platform: sm.platform,
          urlLink: sm.urlLink,
          ownerId: sm.ownerId,
          ownerType: sm.ownerType as 'bitcoiner' | 'organizer',
          createdAt: sm.createdAt,
          updatedAt: sm.updatedAt
        });
        return acc;
      }, {} as Record<string, SocialMedia[]>);

      // Map events with social media
      return events.map((event: any) => ({
        ...event,
        bitcoiners: event.eventBitcoiners.map((eb: any) => ({
          ...eb.bitcoiner,
          socialMedia: socialMediaByBitcoiner[eb.bitcoiner.id] || []
        })),
        sections: event.sections.map((section: any) => ({
          ...section,
          bitcoiners: section.sectionBitcoiners.map((sb: any) => ({
            ...sb.bitcoiner,
            socialMedia: socialMediaByBitcoiner[sb.bitcoiner.id] || []
          }))
        }))
      }));
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    try {
      const now = new Date();
      const events = await prisma.event.findMany({
        where: {
          startDate: { gt: now }
        },
        include: {
          location: true,
          organizer: true,
          eventBitcoiners: {
            include: {
              bitcoiner: true
            }
          },
          websites: true
        },
        take: limit,
        orderBy: { startDate: 'asc' }
      });

      return events.map((event: any) => ({
        ...event,
        bitcoiners: event.eventBitcoiners.map((eb: any) => eb.bitcoiner),
        sections: []
      }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  // Get past events
  static async getPastEvents(limit: number = 10): Promise<Event[]> {
    try {
      const now = new Date();
      const events = await prisma.event.findMany({
        where: {
          startDate: { lte: now }
        },
        include: {
          location: true,
          organizer: true,
          eventBitcoiners: {
            include: {
              bitcoiner: true
            }
          },
          websites: true
        },
        take: limit,
        orderBy: { startDate: 'desc' }
      });

      return events.map((event: any) => ({
        ...event,
        bitcoiners: event.eventBitcoiners.map((eb: any) => eb.bitcoiner),
        sections: []
      }));
    } catch (error) {
      console.error('Error fetching past events:', error);
      throw new Error('Failed to fetch past events');
    }
  }
}