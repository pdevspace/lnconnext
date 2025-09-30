import { EventDetailPage } from "@/components/pages/event/EventDetailPage";
import { EventService } from "@/services/EventService";
import { Metadata } from "next";

// Revalidate every 30 minutes for events (more frequent due to time-sensitive nature)
export const revalidate = 1800;

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const events = await EventService.getEvents();
    return events.map((event) => ({
      eventId: event.id,
    }));
  } catch (error) {
    console.error('Error generating static params for events:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  
  try {
    const event = await EventService.getEventById(eventId);
    
    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    const eventDate = new Date(event.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      title: `${event.name} - ${eventDate}`,
      description: event.description || `Join us for ${event.name} on ${eventDate}.`,
      openGraph: {
        title: `${event.name} - ${eventDate}`,
        description: event.description || `Join us for ${event.name} on ${eventDate}.`,
        type: 'website',
        images: event.images.length > 0 ? event.images : [],
        siteName: 'Bitcoin Events',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${event.name} - ${eventDate}`,
        description: event.description || `Join us for ${event.name} on ${eventDate}.`,
        images: event.images.length > 0 ? event.images : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for event:', error);
    return {
      title: 'Event',
      description: 'Bitcoin community event details.',
    };
  }
}

export default async function EventDetailPageRoute({ params }: PageProps) {
  const { eventId } = await params;
  return <EventDetailPage eventId={eventId} />;
}
