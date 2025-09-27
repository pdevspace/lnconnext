import Image from "next/image";
import { Calendar, ExternalLink, MapPin, Clock, User } from "lucide-react";
import { Event, Website, SocialMedia } from "@/types/event";
import { SocialMediaBox } from "@/components/pages/public/SocialMediaBox";
import { SpeakerBox } from "@/components/pages/public/SpeakerBox";
import { cn } from "@/utils/utils";
import { format } from "date-fns";

interface EventComponentProps {
  event: Event;
  className?: string;
}

// Event Image Component
export function EventImage({ event, className }: { event: Event; className?: string }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg", className)}>
      <Image
        src={event.images[0] || "/images/default-event.jpg"}
        alt={event.name}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}

// Event Add to Calendar Button
export function EventAddToCalendarButton({ event, className }: { event: Event; className?: string }) {
  const createCalendarUrl = () => {
    const startDate = format(event.startDate, "yyyyMMdd'T'HHmmss'Z'");
    const endDate = event.endDate ? format(event.endDate, "yyyyMMdd'T'HHmmss'Z'") : startDate;
    const title = encodeURIComponent(event.name);
    const details = encodeURIComponent(event.description);
    const location = event.location ? encodeURIComponent(event.location.buildingName) : "";
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  return (
    <a
      href={createCalendarUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center p-2 rounded-md bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-blue-700 dark:text-blue-300",
        className
      )}
      title="Add to Calendar"
      aria-label="Add event to Google Calendar"
    >
      <Calendar className="h-4 w-4" />
    </a>
  );
}

// Event Register Button
export function EventRegisterButton({ event, className }: { event: Event; className?: string }) {
  if (!event.register) return null;

  return (
    <a
      href={event.register.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center p-2 rounded-md bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-green-700 dark:text-green-300",
        className
      )}
      title={event.register.displayText}
      aria-label={`${event.register.displayText} - ${event.price === 0 ? 'Free' : `$${event.price}`}`}
    >
      <User className="h-4 w-4" />
    </a>
  );
}

// Event Original Link Buttons
export function EventOriginalLinkButtons({ event, className }: { event: Event; className?: string }) {
  if (!event.website || event.website.length === 0) return null;

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      {event.website.map((website) => (
        <a
          key={website.id}
          href={website.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title={website.displayText}
          aria-label={`Go to ${website.displayText}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

// Event Organizer Box
export function EventOrganizerBox({ event, className }: { event: Event; className?: string }) {
  return (
    <>
      <a
        href={`/organizer/${event.organizer.id}`}
        className="block p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        {/* Line 1: Organizer Name (clickable) */}
        <>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {event.organizer.name}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            {/* Line 2: Social Media (separate clickable area) */}
            <SocialMediaBox socialMedia={event.organizer.socialMedia} />
          </div>
        </>
      </a>
    </>
  );
}

// Event Date Period Box
export function EventDatePeriodBox({ event, className }: { event: Event; className?: string }) {
  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy 'at' HH:mm");
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatDateOnly = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const getDateDisplay = () => {
    if (!event.endDate) {
      return formatDate(event.startDate);
    }

    const startDateOnly = formatDateOnly(event.startDate);
    const endDateOnly = formatDateOnly(event.endDate);

    if (startDateOnly === endDateOnly) {
      // Same date: "Aug 10, 2025 at 09:00 to 16:00"
      return `${startDateOnly} at ${formatTime(event.startDate)} to ${formatTime(event.endDate)}`;
    } else {
      // Different dates: show full range
      return `${formatDate(event.startDate)} to ${formatDate(event.endDate)}`;
    }
  };

  return (
    <div className={cn("p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 flex items-center gap-2", className)}>
      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {getDateDisplay()}
      </div>
    </div>
  );
}

// Event Location Box
export function EventLocationBox({ event, className }: { event: Event; className?: string }) {
  if (!event.location) return null;

  const locationContent = (
    <div className="flex flex-row items-center gap-2">
      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {event.location.buildingName}
      </div>
    </div>
  );

  if (event.location.googleMapsUrl) {
    return (
      <a
        href={event.location.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("flex p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer", className)}
      >
        {locationContent}
      </a>
    );
  }

  return (
    <div className={cn("p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800", className)}>
      {locationContent}
    </div>
  );
}

// Event Schedule Box
export function EventScheduleBox({ event, className }: { event: Event; className?: string }) {
  if (!event.sections || event.sections.length === 0) return null;

  return (
    <div className={cn("p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800", className)}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Schedule</h3>
      <div className="space-y-3">
        {event.sections.map((section) => (
          <div key={section.id} className="border-l-2 border-blue-200 dark:border-blue-800 pl-3">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{section.sectionName}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {format(section.startTime, "HH:mm")}
              {section.endTime && ` - ${format(section.endTime, "HH:mm")}`}
            </div>
            {section.spot.name && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {section.spot.name}
                {section.spot.floor && ` (${section.spot.floor})`}
              </div>
            )}
            {section.speakers.length > 0 && (
              <div className="mt-1">
                <div className="flex flex-col gap-2">
                  {section.speakers.map((speaker) => (
                    <a
                      key={speaker.id}
                      href={`/speaker/${speaker.id}`}
                      className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {speaker.name}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Event Component
export function EventComponent({ event, className }: EventComponentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-10 lg:gap-8">
        {/* Left Column (30%) */}
        <div className="lg:col-span-3 space-y-4">
          <div id="event-image">
            <EventImage event={event} />
          </div>
          <div id="event-actions" className="flex gap-2">
            <EventOriginalLinkButtons event={event} />
            <EventRegisterButton event={event} className="flex-1" />
            <EventAddToCalendarButton event={event} className="flex-1" />
          </div>
          <div id="event-speakers">
            <SpeakerBox speakers={event.speakers} />
          </div>
        </div>

        {/* Right Column (70%) */}
        <div className="lg:col-span-7 space-y-4">
          <h1 id="event-name" className="text-4xl font-bold text-gray-900 dark:text-gray-100">{event.name}</h1>
          <div id="event-organizer">
            <EventOrganizerBox event={event} />
          </div>
          <div id="event-date">
            <EventDatePeriodBox event={event} />
          </div>
          <div id="event-location">
            <EventLocationBox event={event} />
          </div>
          <div id="event-description" className="prose prose-sm max-w-none">
            <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
          </div>
          <div id="event-schedule">
            <EventScheduleBox event={event} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        <div id="event-image">
          <EventImage event={event} />
        </div>
        <h1 id="event-name" className="text-2xl font-bold text-gray-900 dark:text-gray-100">{event.name}</h1>
        <div id="event-organizer">
          <EventOrganizerBox event={event} />
        </div>
        <div id="event-actions" className="flex gap-2">
          <EventDatePeriodBox event={event} className="flex-1" />
          <EventRegisterButton event={event} />
          <EventAddToCalendarButton event={event} />
          <EventOriginalLinkButtons event={event} />
        </div>
        <div id="event-location">
          <EventLocationBox event={event} />
        </div>
        <div id="event-description" className="prose prose-sm max-w-none">
          <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
        </div>
        <div id="event-schedule">
          <EventScheduleBox event={event} />
        </div>
      </div>
    </div>
  );
}
