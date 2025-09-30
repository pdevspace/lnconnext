/**
 * Bitcoiner Service
 * Business logic for bitcoiner management
 */

import { prisma } from '@/prisma/prisma';
import { Bitcoiner, BitcoinerFormData, BitcoinerFilters } from '@/models/bitcoiner';
import { SocialMedia } from '@/models/event';

export class BitcoinerService {
  // Get bitcoiner by ID with all related data
  static async getBitcoinerById(bitcoinerId: string): Promise<Bitcoiner | null> {
    try {
      const bitcoiner = await prisma.bitcoiner.findUnique({
        where: { id: bitcoinerId },
        include: {
          socialMedia: true
        }
      });

      if (!bitcoiner) {
        return null;
      }

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        bio: bitcoiner.bio || undefined,
        avatar: bitcoiner.avatar || undefined,
        expertise: bitcoiner.expertise,
        isActive: bitcoiner.isActive,
        socialMedia: (bitcoiner as any).socialMedia?.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          ownerId: social.ownerId,
          ownerType: social.ownerType
        })) || [],
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error fetching bitcoiner:', error);
      throw new Error('Failed to fetch bitcoiner');
    }
  }

  // Get all bitcoiners with filtering and pagination
  static async getAllBitcoiners(filters: BitcoinerFilters = {}): Promise<Bitcoiner[]> {
    try {
      const where: any = {};

      if (filters.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      if (filters.expertise && filters.expertise.length > 0) {
        where.expertise = {
          hasSome: filters.expertise
        };
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const bitcoiners = await prisma.bitcoiner.findMany({
        where,
        include: {
          socialMedia: true
        },
        take: filters.limit || 50,
        skip: filters.offset || 0,
        orderBy: { name: 'asc' }
      });

      return bitcoiners.map(bitcoiner => ({
        id: bitcoiner.id,
        name: bitcoiner.name,
        bio: bitcoiner.bio || undefined,
        avatar: bitcoiner.avatar || undefined,
        expertise: bitcoiner.expertise,
        isActive: bitcoiner.isActive,
        socialMedia: (bitcoiner as any).socialMedia?.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          ownerId: social.ownerId,
          ownerType: social.ownerType
        })) || [],
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching bitcoiners:', error);
      throw new Error('Failed to fetch bitcoiners');
    }
  }

  // Create new bitcoiner
  static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner> {
    try {
      const bitcoiner = await prisma.bitcoiner.create({
        data: {
          name: data.name,
          bio: data.bio,
          avatar: data.avatar,
          expertise: data.expertise,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink,
              ownerType: 'bitcoiner'
            }))
          }
        },
        include: {
          socialMedia: true
        }
      });

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        bio: bitcoiner.bio || undefined,
        avatar: bitcoiner.avatar || undefined,
        expertise: bitcoiner.expertise,
        isActive: bitcoiner.isActive,
        socialMedia: (bitcoiner as any).socialMedia?.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          ownerId: social.ownerId,
          ownerType: social.ownerType
        })) || [],
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error creating bitcoiner:', error);
      throw new Error('Failed to create bitcoiner');
    }
  }

  // Update bitcoiner
  static async updateBitcoiner(id: string, data: BitcoinerFormData): Promise<Bitcoiner | null> {
    try {
      // First, delete existing social media
      await prisma.socialMedia.deleteMany({
        where: { 
          ownerId: id,
          ownerType: 'bitcoiner'
        }
      });

      // Then update the bitcoiner with new social media
      const bitcoiner = await prisma.bitcoiner.update({
        where: { id },
        data: {
          name: data.name,
          bio: data.bio,
          avatar: data.avatar,
          expertise: data.expertise,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink,
              ownerType: 'bitcoiner'
            }))
          }
        },
        include: {
          socialMedia: true
        }
      });

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        bio: bitcoiner.bio || undefined,
        avatar: bitcoiner.avatar || undefined,
        expertise: bitcoiner.expertise,
        isActive: bitcoiner.isActive,
        socialMedia: (bitcoiner as any).socialMedia?.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          ownerId: social.ownerId,
          ownerType: social.ownerType
        })) || [],
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error updating bitcoiner:', error);
      throw new Error('Failed to update bitcoiner');
    }
  }

  // Delete bitcoiner
  static async deleteBitcoiner(id: string): Promise<boolean> {
    try {
      await prisma.bitcoiner.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting bitcoiner:', error);
      throw new Error('Failed to delete bitcoiner');
    }
  }

  // Search bitcoiners by query
  static async searchBitcoiners(query: string): Promise<Bitcoiner[]> {
    try {
      const bitcoiners = await prisma.bitcoiner.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        include: {
          socialMedia: true
        },
        orderBy: { name: 'asc' }
      });

      return bitcoiners.map(bitcoiner => ({
        id: bitcoiner.id,
        name: bitcoiner.name,
        bio: bitcoiner.bio || undefined,
        avatar: bitcoiner.avatar || undefined,
        expertise: bitcoiner.expertise,
        isActive: bitcoiner.isActive,
        socialMedia: (bitcoiner as any).socialMedia?.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          ownerId: social.ownerId,
          ownerType: social.ownerType
        })) || [],
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      }));
    } catch (error) {
      console.error('Error searching bitcoiners:', error);
      throw new Error('Failed to search bitcoiners');
    }
  }
}