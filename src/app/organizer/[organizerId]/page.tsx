import OrganizerPage from "@/components/pages/organizer/OrganizerPage";
import { getAllOrganizers } from "@/data/OrganizerService";

interface OrganizerPageProps {
  params: Promise<{
    organizerId: string;
  }>;
}

export async function generateStaticParams() {
  const organizers = getAllOrganizers();
  return organizers.map((organizer) => ({
    organizerId: organizer.id,
  }));
}

export default async function OrganizerPageRoute({ params }: OrganizerPageProps) {
  const { organizerId } = await params;
  return <OrganizerPage organizerId={organizerId} />;
}
