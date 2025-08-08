"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAllOrganizers,
  getEventsByOrganizer,
} from "@/data/OrganizerService";
import { Organizer } from "@/types/event";
import { User, Calendar, Users } from "lucide-react";

export default function OrganizerListPage() {
  const organizers = getAllOrganizers();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 h-screen overflow-y-auto mb-[130px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Organizers</h1>
          <p className="text-muted-foreground">
            Browse all event organizers and their events
          </p>
        </div>

        {/* Organizers List */}
        <div className="space-y-4">
          {organizers.map((organizer) => {
            const organizerEvents = getEventsByOrganizer(organizer.id);
            const upcomingEvents = organizerEvents.filter(
              (event) => new Date(event.startDate) > new Date()
            );
            const pastEvents = organizerEvents.filter(
              (event) => new Date(event.startDate) <= new Date()
            );

            return (
              <Link key={organizer.id} href={`/organizer/${organizer.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer m-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Organizer Info */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold w-40">
                            {organizer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {organizer.speakers.length} speakers
                          </p>
                        </div>
                      </div>

                      {/* Event Stats */}
                      <div className="flex items-center gap-6 text-sm flex-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{organizerEvents.length} total events</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <Users className="h-4 w-4" />
                          <span>{upcomingEvents.length} upcoming</span>
                        </div>
                      </div>

                      {/* Recent Events Preview */}
                      {organizerEvents.length > 0 && (
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Recent Events
                          </p>
                          <div className="space-y-1">
                            {organizerEvents
                              .sort(
                                (a, b) =>
                                  new Date(b.startDate).getTime() -
                                  new Date(a.startDate).getTime()
                              )
                              .slice(0, 2)
                              .map((event) => (
                                <div key={event.id} className="text-sm">
                                  <p className="font-medium truncate">
                                    {event.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      event.startDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {organizers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Organizers Found
              </h3>
              <p className="text-muted-foreground">
                There are no organizers available at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
