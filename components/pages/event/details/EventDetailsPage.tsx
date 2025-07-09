"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents, getEventById } from "@/data/EventService";
import { cn, formatDate, formatTime, getTimeRange, isEventLive, isEventUpcoming } from "@/lib/utils";
import { Event } from "@/types/event";
import { Calendar, Clock, ExternalLink, Gamepad2, Heart, MapPin, Mic, Share2, Users } from "lucide-react";
import { useState } from "react";

interface EventDetailsPageProps {
  eventId: string;
}

export default function EventDetailsPage({ eventId }: EventDetailsPageProps) {
  const [event] = useState<Event>(() => {
    const foundEvent = getEventById(eventId);
    if (!foundEvent) {
      // Return a default event if not found
      return getAllEvents()[0];
    }
    return foundEvent;
  });
  const [savedEvent, setSavedEvent] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [personalSchedule, setPersonalSchedule] = useState<string[]>([]);

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

  const handleAddToCalendar = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${event.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${event.endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location?.buildingName || "")}`;
    window.open(calendarUrl, "_blank");
  };

  const togglePersonalSchedule = (sectionId: string) => {
    setPersonalSchedule(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const getEventStatus = () => {
    if (isLive) return { text: "LIVE NOW", color: "bg-red-500" };
    if (isUpcoming) return { text: "UPCOMING", color: "bg-green-500" };
    return { text: "PAST EVENT", color: "bg-gray-500" };
  };

  const status = getEventStatus();

  function safeFormatDate(date: unknown) {
    return date instanceof Date ? formatDate(date) : "";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Event Header Section */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={event.images[0]}
            alt={event.name}
            className="w-full h-full object-cover object-center"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.style.backgroundColor = "#f3f4f6";
            }}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-white border-0", status.color)}>{status.text}</Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareEvent}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSaveEvent}
              className={cn(
                "bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30",
                savedEvent && "bg-red-500/20 border-red-300"
              )}
            >
              <Heart className={cn("h-4 w-4", savedEvent && "fill-current")} />
            </Button>
          </div>

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {event.category}
                </Badge>
                {event.eventSeries && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {event.eventSeries.seriesName}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{event.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {safeFormatDate(event.startDate)}
                  {event.startDate && event.endDate && " - "}
                  {safeFormatDate(event.endDate)}
                </div>
                {event.location && (
                  <a
                    href={event.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4" />
                    {event.location.buildingName}
                  </a>
                )}
                {typeof event.currentAttendees === "number" && typeof event.capacity === "number" && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.currentAttendees?.toLocaleString()} / {event.capacity?.toLocaleString()} attendees
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {event.price && (
                  <span className="text-2xl font-bold text-primary">฿{event.price.toLocaleString()}</span>
                )}
                <span className="text-muted-foreground">per ticket</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddToCalendar}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button>
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Get Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 mt-[70px] pb-[100px]">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Speakers</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((speaker, idx) => (
                          <Badge key={speaker.id || idx} variant="secondary">
                            {speaker.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.sections && event.sections.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Schedule</h3>
                      <ul className="space-y-2">
                        {event.sections.map(section => (
                          <li key={section.id} className="border rounded p-2">
                            <div className="font-semibold">{section.sectionName}</div>
                            <div className="text-sm text-gray-600">
                              {section.startTime ? formatTime(section.startTime) : ""}
                              {section.endTime ? ` - ${formatTime(section.endTime)}` : ""}
                              {section.spot && section.spot.name && ` @ ${section.spot.name}`}
                            </div>
                            <div className="text-xs text-gray-500">{section.description}</div>
                            {section.speakers && section.speakers.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {section.speakers.map((sp, i) => (
                                  <Badge key={sp.id || i} variant="outline">
                                    {sp.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.website && event.website.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Event Links</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.website.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {idx === 0 ? "Event Website" : `Link ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Speakers Tab */}
          <TabsContent value="speakers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Speakers</CardTitle>
                <CardDescription>Meet the industry experts and thought leaders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.speakers.map(speaker => (
                    <Card key={speaker.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-16 h-16 rounded-full object-cover object-center bg-gray-200"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.parentElement!.innerHTML = `
                                <div class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span class="text-gray-600 font-semibold text-lg">${speaker.name.charAt(0)}</span>
                                </div>
                              `;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{speaker.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{speaker.title}</p>
                            <div className="flex flex-wrap gap-1">
                              {speaker.expertise.slice(0, 2).map(skill => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
                <CardDescription>Plan your time at the event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.sections.map(section => (
                    <Card key={section.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{section.sectionName}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePersonalSchedule(section.id)}
                                className={cn(
                                  "h-6 px-2 text-xs",
                                  personalSchedule.includes(section.id) && "bg-primary/10 text-primary"
                                )}
                              >
                                {personalSchedule.includes(section.id) ? "Remove" : "Add"}
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {section.startTime && section.endTime
                                  ? getTimeRange(section.startTime, section.endTime)
                                  : "Time TBD"}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {section.spot.name} ({section.spot.floor})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatDate(section.startTime)}</div>
                            <div className="text-xs text-muted-foreground">{formatTime(section.startTime)}</div>
                          </div>
                        </div>

                        {section.speakers.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Mic className="h-3 w-3" />
                              Speakers:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {section.speakers.map(speaker => (
                                <div key={speaker.id} className="flex items-center gap-1">
                                  <img
                                    src={speaker.avatar}
                                    alt={speaker.name}
                                    className="w-6 h-6 rounded-full object-cover object-center bg-gray-200"
                                    onError={e => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      target.parentElement!.innerHTML = `
                                        <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                          <span class="text-gray-600 font-semibold text-xs">${speaker.name.charAt(0)}</span>
                                        </div>
                                      `;
                                    }}
                                  />
                                  <span className="text-xs">{speaker.name}</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
