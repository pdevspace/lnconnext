"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatTimeRange, isToday } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { Clock, MapPin, Users } from "lucide-react";
import React from "react";

interface EventCardProps {
  event: CalendarEvent;
  variant?: "compact" | "detailed";
  onClick?: (event: CalendarEvent) => void;
  onStatusChange?: (
    eventId: string,
    status: CalendarEvent["userStatus"]
  ) => void;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  const isEventToday = isToday(new Date(event.startDate));

  const handleCardClick = () => {
    window.location.href = `/event/${event.id}`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${event.description}`);
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
        event.color.replace("bg-", "border-l-"),
        isEventToday && "ring-2 ring-blue-500",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{event.title}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatTimeRange(
                  new Date(event.startDate),
                  new Date(event.endDate)
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div>
            {event.speakers.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {event.speakers.slice(0, 2).join(", ")}
                  {event.speakers.length > 2 &&
                    ` +${event.speakers.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
