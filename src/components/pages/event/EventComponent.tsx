import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  MapPin,
  Clock,
  Users,
  Mic,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Speaker, Website } from "@/types/event";
import Link from "next/link";

interface AddToCalendarButtonProps {
  event: {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location?: {
      buildingName?: string;
    };
  };
  className?: string;
}

export function AddToCalendarButton({
  event,
  className,
}: AddToCalendarButtonProps) {
  const handleAddToCalendar = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${event.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${event.endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location?.buildingName || "")}`;
    window.open(calendarUrl, "_blank");
  };

  return (
    <Button onClick={handleAddToCalendar} className={cn("w-full", className)}>
      <Calendar className="h-4 w-4 mr-2" />
      Add to Calendar
    </Button>
  );
}

interface VisitWebsiteButtonProps {
  website: Website;
  className?: string;
}

export function VisitWebsiteButton({
  website,
  className,
}: VisitWebsiteButtonProps) {
  return (
    <Button variant="outline" className={cn("w-full", className)} asChild>
      <a href={website.sourceUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4 mr-2" />
        {website.displayText}
      </a>
    </Button>
  );
}

interface EventTicketBoxProps {
  price?: number;
  ticketWebsite?: Website;
}

export function EventTicketBox({ price, ticketWebsite }: EventTicketBoxProps) {
  if (!price && !ticketWebsite) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Event Tickets</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {price && (
          <div className="mb-3">
            <div className="text-2xl font-bold text-primary">${price}</div>
            <div className="text-sm text-muted-foreground">per ticket</div>
          </div>
        )}
        {ticketWebsite && (
          <Button className="w-full" asChild>
            <a
              href={ticketWebsite.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {ticketWebsite.displayText}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface EventSpeakerBoxProps {
  speakers: Speaker[];
}

export function EventSpeakerBox({ speakers }: EventSpeakerBoxProps) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Speakers</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">
                  {speaker.name.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <div className="font-medium text-sm">
                  {speaker.name || "Unknown Speaker"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface EventParticipantBoxProps {
  participants?: number;
}

export function EventParticipantBox({
  participants,
}: EventParticipantBoxProps) {
  if (!participants) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Participants</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{participants}</span>
          <span className="text-sm text-muted-foreground">registered</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrganizerBoxProps {
  organizer: {
    id: string;
    name: string;
    socialMedia?: Array<{
      id: string;
      displayText: string;
      username: string;
      platform: "facebook" | "youtube" | "other";
      urlLink: string;
    }>;
  };
}

export function OrganizerBox({ organizer }: OrganizerBoxProps) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Link href={`/organizer/${organizer.id}`} className="block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {organizer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{organizer.name}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>

          {organizer.socialMedia &&
            organizer.socialMedia.length > 0 && (
              <div className="flex gap-2">
                {organizer.socialMedia.map((social) => (
                  <a
                    key={`${organizer.id}-${social.id}`}
                    href={social.urlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xs font-medium capitalize">
                      {social.displayText}
                    </span>
                  </a>
                ))}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

interface EventScheduleBoxProps {
  sections: Array<{
    id: string;
    sectionName: string;
    description: string;
    startTime: Date;
    endTime?: Date;
    spot: {
      name?: string;
      floor?: string;
    };
    speakers: Speaker[];
  }>;
}

export function EventScheduleBox({ sections }: EventScheduleBoxProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Event Schedule</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{section.sectionName}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {section.startTime && section.endTime
                          ? `${section.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${section.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "Time TBD"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {section.spot.name}{" "}
                        {section.spot.floor && `(${section.spot.floor})`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {section.startTime.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {section.speakers.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Mic className="h-3 w-3" />
                      Speakers:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {section.speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="flex items-center gap-1"
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-xs">
                              {speaker.name?.charAt(0) || "?"}
                            </span>
                          </div>
                          <span className="text-xs">
                            {speaker.name || "Unknown Speaker"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface OtherEventsBoxProps {
  organizerEvents: Array<{
    id: string;
    name: string;
    startDate: Date;
    images: string[];
  }>;
}

export function OtherEventsBox({ organizerEvents }: OtherEventsBoxProps) {
  if (!organizerEvents || organizerEvents.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Other Events by This Organizer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {organizerEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image
                  src={event.images[0]}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{event.name}</div>
                <div className="text-xs text-muted-foreground">
                  {event.startDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
