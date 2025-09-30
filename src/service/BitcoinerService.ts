import { Bitcoiner, BitcoinerFormData } from '@/model/bitcoiner';
import { prisma } from '@/prisma/prisma';

export class BitcoinerService {
  static async getAllBitcoiners(filters?: {
    search?: string;
    platform?: string;
  }): Promise<Bitcoiner[]> {
    try {
      const where: any = {};

      if (filters?.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      if (filters?.platform) {
        where.socialMedia = {
          some: {
            platform: filters.platform
          }
        };
      }

      const bitcoiners = await prisma.bitcoiner.findMany({
        where,
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return bitcoiners.map((bitcoiner: any) => ({
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          bitcoinerId: social.bitcoinerId
        })),
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching bitcoiners:', error);
      
      // Enhanced error logging for MongoDB issues
      if (error instanceof Error) {
        if (error.message.includes('Server selection timeout')) {
          console.error('MongoDB Atlas connection timeout - check network access and IP whitelist');
        } else if (error.message.includes('InternalError') || error.message.includes('fatal alert')) {
          console.error('MongoDB Atlas SSL/TLS connection error - check connection string and certificates');
        } else if (error.message.includes('authentication')) {
          console.error('MongoDB Atlas authentication error - check username/password');
        }
      }
      
      throw new Error('Failed to fetch bitcoiners');
    }
  }

  static async getBitcoinerById(id: string): Promise<Bitcoiner | null> {
    try {
      const bitcoiner = await prisma.bitcoiner.findUnique({
        where: { id },
        include: {
          socialMedia: true
        }
      });

      if (!bitcoiner) return null;

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          bitcoinerId: social.bitcoinerId
        })),
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error fetching bitcoiner:', error);
      throw new Error('Failed to fetch bitcoiner');
    }
  }

  static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner> {
    try {
      const bitcoiner = await prisma.bitcoiner.create({
        data: {
          name: data.name,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink
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
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          bitcoinerId: social.bitcoinerId
        })),
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error creating bitcoiner:', error);
      throw new Error('Failed to create bitcoiner');
    }
  }

  static async updateBitcoiner(id: string, data: BitcoinerFormData): Promise<Bitcoiner | null> {
    try {
      // First, delete existing social media
      await prisma.socialMedia.deleteMany({
        where: { bitcoinerId: id }
      });

      // Then update the bitcoiner with new social media
      const bitcoiner = await prisma.bitcoiner.update({
        where: { id },
        data: {
          name: data.name,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink
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
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink,
          bitcoinerId: social.bitcoinerId
        })),
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error updating bitcoiner:', error);
      throw new Error('Failed to update bitcoiner');
    }
  }

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

  static async searchBitcoiners(query: string): Promise<Bitcoiner[]> {
    return this.getAllBitcoiners({ search: query });
  }

  static async filterByPlatform(platform: string): Promise<Bitcoiner[]> {
    return this.getAllBitcoiners({ platform });
  }
}
