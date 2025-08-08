"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCard from "./EventCard";
import { Event } from "@/types/event";

interface EventDetailsProps {
  selectDate: Date;
  selectEvent: Event[];
}

const EventDetails = ({ selectDate, selectEvent }: EventDetailsProps) => {
  return (
    <div className="pointer-events-auto bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <div className="text-lg font-semibold">
          {selectDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <Badge variant="outline">{selectEvent.length} events</Badge>
          {(selectDate.getDay() === 0 || selectDate.getDay() === 6) && (
            <Badge variant="secondary">Weekend</Badge>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {selectEvent.length > 0
          ? selectEvent.map((event: Event) => (
              <EventCard key={event.id} event={event} variant="compact" />
            ))
          : null}
      </div>
    </div>
  );
};

export default EventDetails;
