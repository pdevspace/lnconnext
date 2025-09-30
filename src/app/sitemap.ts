import { MetadataRoute } from 'next';
import { OrganizerService } from '@/services/OrganizerService';
import { EventService } from '@/services/EventService';
import { BitcoinerService } from '@/services/BitcoinerService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  
  try {
    // Fetch all data in parallel
    const [organizers, events, bitcoiners] = await Promise.all([
      OrganizerService.getAllOrganizers(),
      EventService.getEvents(),
      BitcoinerService.getAllBitcoiners(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/organizer`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/event`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/bitcoiner`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/calendar`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
    ];

    // Dynamic pages
    const organizerPages: MetadataRoute.Sitemap = organizers.map((organizer) => ({
      url: `${baseUrl}/organizer/${organizer.id}`,
      lastModified: organizer.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${baseUrl}/event/${event.id}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const bitcoinerPages: MetadataRoute.Sitemap = bitcoiners.map((bitcoiner) => ({
      url: `${baseUrl}/bitcoiner/${bitcoiner.id}`,
      lastModified: bitcoiner.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticPages, ...organizerPages, ...eventPages, ...bitcoinerPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
