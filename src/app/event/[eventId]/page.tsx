import EventDetailsPage from "@/components/pages/event/details/EventDetailsPage";
import { getAllEvents } from "@/data/EventService";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { eventId } = await params;
  return <EventDetailsPage eventId={eventId} />;
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map(event => ({
    eventId: event.id,
  }));
}
