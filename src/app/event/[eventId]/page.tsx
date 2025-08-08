import EventPage from "@/components/pages/event/EventPage";
import { getAllEvents } from "@/data/EventService";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default async function EventPageRoute({ params }: PageProps) {
  const { eventId } = await params;
  return <EventPage eventId={eventId} />;
}
