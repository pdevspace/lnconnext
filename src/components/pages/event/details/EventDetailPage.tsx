"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllEvents, getEventById } from "@/data/EventService";
import {
  cn,
  formatDate,
  formatTime,
  isEventLive,
  isEventUpcoming,
} from "@/lib/utils";
import { Event } from "@/types/event";
import {
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";
import { useState } from "react";
import {
  AddToCalendarButton,
  VisitWebsiteButton,
  EventTicketBox,
  EventSpeakerBox,
  EventParticipantBox,
  OrganizerBox,
  EventScheduleBox,
  OtherEventsBox,
} from "./event-card";

interface EventDetailsPageProps {
  eventId: string;
}

export default function EventDetailPage({ eventId }: EventDetailsPageProps) {
  const [event] = useState<Event>(() => {
    const foundEvent = getEventById(eventId);
    if (!foundEvent) {
      // Return a default event if not found
      return getAllEvents()[0];
    }
    return foundEvent;
  });
  const [savedEvent, setSavedEvent] = useState(false);

  const isLive = isEventLive(event.startDate, event.endDate);
  const isUpcoming = isEventUpcoming(event.startDate);

  const handleSaveEvent = () => {
    setSavedEvent(!savedEvent);
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getEventStatus = () => {
    if (isLive) return { text: "LIVE NOW", color: "bg-red-500" };
    if (isUpcoming) return { text: "UPCOMING", color: "bg-green-500" };
    return { text: "PAST EVENT", color: "bg-gray-500" };
  };

  const status = getEventStatus();

  // Get other events by the same organizer
  const otherOrganizerEvents = getAllEvents().filter(
    (e) => e.id !== event.id && e.organizer?.id === event.organizer?.id
  );

  function safeFormatDate(date: unknown) {
    return date instanceof Date ? formatDate(date) : "";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Status Badge and Action Buttons */}
      <div className="sticky top-[70px] z-10 bg-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={cn("text-white border-0", status.color)}>
                {status.text}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShareEvent}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveEvent}
                className={cn(savedEvent && "bg-red-500/20 border-red-300")}
              >
                <Heart
                  className={cn("h-4 w-4", savedEvent && "fill-current")}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] mt-[70px]">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">
          {/* Left Column - 30% */}
          <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 pb-[60px]">
            {/* Event Image */}
            <div className="aspect-square rounded-lg overflow-hidden relative">
              <Image
                src={event.images[0]}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
              />
            </div>

            {/* Add to Calendar Button */}
            <AddToCalendarButton event={event} />

            {/* Visit Website */}
            <div className="space-y-2">
              {event.website &&
                event.website.length > 0 &&
                event.website.map((url, index) => (
                  <VisitWebsiteButton key={index} url={url} index={index} />
                ))}
            </div>

            {/* Event Ticket Box */}
            {event.price > 0 && (
              <EventTicketBox
                price={event.price}
                ticketUrl={event.website?.[0]}
              />
            )}

            {/* Event Speaker Box */}
            <EventSpeakerBox speakers={event.speakers} />

            {/* Event Participant Box */}
            <EventParticipantBox participants={undefined} />
          </div>

          {/* Right Column - 70% */}
          <div className="lg:col-span-7 space-y-6 overflow-y-auto pr-2 pb-[60px]">
            {/* Big Event Name */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {event.name}
              </h1>
            </div>

            {/* Organizer Box */}
            {event.organizer && <OrganizerBox organizer={event.organizer} />}

            {/* Event Time */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">
                  {safeFormatDate(event.startDate)}
                  {event.startDate && event.endDate && " - "}
                  {safeFormatDate(event.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
              </div>
            </div>

            {/* Event Location */}
            {event.location && (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">
                    {event.location.buildingName}
                  </span>
                </div>
                {event.location.googleMapsUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={event.location.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Google Maps
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Event Short Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Schedule Box */}
            <EventScheduleBox sections={event.sections} />

            {/* Other Events by Same Organizer */}
            <OtherEventsBox organizerEvents={otherOrganizerEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
