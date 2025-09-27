"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllEvents } from "@/data/EventService";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  MapPin,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { formatDate, formatTime, isEventUpcoming } from "@/utils/utils";

export default function EventListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasScrolledToUpcoming, setHasScrolledToUpcoming] = useState(false);
  const upcomingEventRef = useRef<HTMLDivElement>(null);

  const allEvents = getAllEvents();
  const upcomingEvents = allEvents.filter((event) =>
    isEventUpcoming(event.startDate)
  );
  const firstUpcomingEvent = upcomingEvents[0];

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.speakers &&
        event.speakers.some((speaker: any) =>
          speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesSearch;
  });

  // Scroll to first upcoming event on page load
  useEffect(() => {
    if (
      !hasScrolledToUpcoming &&
      firstUpcomingEvent &&
      upcomingEventRef.current
    ) {
      const timer = setTimeout(() => {
        upcomingEventRef.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });

        // Scroll 130px more up after the initial scroll
        setTimeout(() => {
          window.scrollBy({
            top: -130,
            behavior: "instant",
          });
        }, 10);

        setHasScrolledToUpcoming(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [hasScrolledToUpcoming, firstUpcomingEvent]);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header Bar */}
      <div className="border-b bg-card fixed top-[70px] left-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Events</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search events, speakers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
        {/* Events List */}
        <div className="space-y-4 max-w-none mx-0 px-4 mb-[800px]">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              ref={
                event.id === firstUpcomingEvent?.id ? upcomingEventRef : null
              }
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(event.startDate)}</span>
                </div>
              </div>
              <Link href={`/event/${event.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Event Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={event.images[0] || "/images/placeholder.jpg"}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {event.name}
                          </h3>
                          <Badge
                            variant={
                              isEventUpcoming(event.startDate)
                                ? "default"
                                : "secondary"
                            }
                          >
                            {isEventUpcoming(event.startDate)
                              ? "Upcoming"
                              : "Past"}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location.buildingName}
                            </span>
                          )}
                          {event.speakers.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.speakers.length} speakers
                            </span>
                          )}
                        </div>

                        {/* Speaker Badges */}
                        {event.speakers && event.speakers.length > 0 && (
                          <div className="flex gap-1 mt-3">
                            {event.speakers
                              .slice(0, 3)
                              .map((speaker: any, index) => (
                                <Badge
                                  key={speaker.id || index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {speaker.name}
                                </Badge>
                              ))}
                            {event.speakers.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{event.speakers.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Website Links - Outside the main card link */}
              {event.website.length > 0 && (
                <div className="flex gap-2 mt-2 ml-6">
                  {event.website.map((website, index) => (
                    <a
                      key={index}
                      href={website.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {website.displayText}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No events found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
