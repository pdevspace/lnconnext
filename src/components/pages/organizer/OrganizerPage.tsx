"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getOrganizerById,
  getEventsByOrganizer,
} from "@/data/OrganizerService";
import { Event, Organizer } from "@/types/event";
import speakersData from "@/data/event/speakers.json";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
  Filter,
  User,
  Globe,
  Facebook,
  Youtube,
  Mic,
} from "lucide-react";
import { cn, formatDate, formatTime, isEventUpcoming } from "@/lib/utils";

interface OrganizerPageProps {
  organizerId: string;
}

export default function OrganizerPage({ organizerId }: OrganizerPageProps) {
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    loadData();
  }, [organizerId]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const organizerData = getOrganizerById(organizerId);
      const organizerEvents = getEventsByOrganizer(organizerId);

      setOrganizer(organizerData || null);
      setEvents(organizerEvents);
    } catch (error) {
      console.error("Error loading organizer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "upcoming") return isEventUpcoming(event.startDate);
    if (filter === "past") return !isEventUpcoming(event.startDate);
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filter === "upcoming") {
      return a.startDate.getTime() - b.startDate.getTime();
    }
    return b.startDate.getTime() - a.startDate.getTime();
  });

  const upcomingEvents = events.filter((event) =>
    isEventUpcoming(event.startDate)
  );
  const pastEvents = events.filter(
    (event) => !isEventUpcoming(event.startDate)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading organizer data...</p>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Organizer Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested organizer could not be found.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 h-screen overflow-y-auto mb-[130px]">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{organizer.name}</h1>
              <p className="text-muted-foreground">{events.length} events</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({events.length})
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("upcoming")}
              >
                Upcoming ({upcomingEvents.length})
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("past")}
              >
                Past ({pastEvents.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {organizer.name}
                  </h2>

                  {/* Speaker Information */}
                  {organizer.speakers && organizer.speakers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {organizer.speakers.map((speakerId, index) => {
                        // Find speaker data from speakers.json
                        const speaker = speakersData.speakers.find(
                          (s: any) => s.id === speakerId
                        );
                        return (
                          <div
                            key={speakerId}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full text-sm"
                          >
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {speaker ? speaker.name : `Speaker ${index + 1}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Social Media Links */}
                  {organizer.socialMedia &&
                    Object.keys(organizer.socialMedia).length > 0 && (
                      <div className="flex gap-3">
                        {Object.entries(organizer.socialMedia).map(
                          ([platform, data]) => {
                            // Get appropriate icon based on platform
                            const getIcon = (platform: string) => {
                              switch (platform.toLowerCase()) {
                                case "facebook":
                                case "facebook2":
                                  return <Facebook className="h-4 w-4" />;
                                case "youtube":
                                  return <Youtube className="h-4 w-4" />;
                                default:
                                  return <Globe className="h-4 w-4" />;
                              }
                            };

                            // Get display name based on platform
                            const getDisplayName = (platform: string) => {
                              switch (platform.toLowerCase()) {
                                case "facebook":
                                case "facebook2":
                                  return "Facebook";
                                case "youtube":
                                  return "YouTube";
                                default:
                                  return platform;
                              }
                            };

                            return (
                              <a
                                key={platform}
                                href={data.urlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5"
                              >
                                {getIcon(platform)}
                                <span>{getDisplayName(platform)}</span>
                              </a>
                            );
                          }
                        )}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          {sortedEvents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No events found for this filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <div key={event.id}>
                  <Link href={`/event/${event.id}`} className="block">
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
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(event.startDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(event.startDate)}
                              </span>
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
          )}
        </div>
      </div>
    </div>
  );
}
