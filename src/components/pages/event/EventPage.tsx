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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = getAllEvents().filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.speakers &&
        event.speakers.some((speaker: any) =>
          speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesSearch;
  });

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
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-none mx-0 px-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                {event.images && event.images.length > 0 && (
                  <div
                    className="h-48 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${event.images[0]})` }}
                  />
                )}
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {event.location?.buildingName || "TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{event.speakers?.length || 0} speakers</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {event.speakers &&
                      event.speakers.slice(0, 2).map((speaker: any, index) => (
                        <Badge
                          key={speaker.id || index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {speaker.name}
                        </Badge>
                      ))}
                    {event.speakers && event.speakers.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.speakers.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/event/${event.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
