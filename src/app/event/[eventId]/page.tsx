import EventDetailPage from "@/components/pages/event/details/EventDetailPage";
import { getAllEvents } from "@/data/EventService";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetail({ params }: PageProps) {
  const { eventId } = await params;
  return <EventDetailPage eventId={eventId} />;
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    eventId: event.id,
  }));
}
