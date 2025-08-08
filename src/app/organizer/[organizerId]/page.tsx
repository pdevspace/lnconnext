import OrganizerPage from "@/components/pages/organizer/OrganizerPage";
import { getAllOrganizers } from "@/data/OrganizerService";

interface OrganizerPageProps {
  params: {
    organizerId: string;
  };
}

export async function generateStaticParams() {
  const organizers = getAllOrganizers();
  return organizers.map((organizer) => ({
    organizerId: organizer.id,
  }));
}

export default function OrganizerPageRoute({ params }: OrganizerPageProps) {
  return <OrganizerPage organizerId={params.organizerId} />;
}
