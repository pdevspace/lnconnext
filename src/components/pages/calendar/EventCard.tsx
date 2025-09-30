"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatTimeRange, isToday } from "@/utils/calendar-utils";
import { cn } from "@/utils/utils";
import { Event } from "@/types/event";
import { Clock, MapPin, Users } from "lucide-react";
import React from "react";

interface EventCardProps {
  event: Event;
  variant?: "compact" | "detailed";
  onClick?: (event: Event) => void;
  onStatusChange?: (eventId: string) => void;
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
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${event.name} - ${event.description}`);
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
        isEventToday && "ring-2 ring-blue-500",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{event.name}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatTimeRange(
                  new Date(event.startDate),
                  event.endDate ? new Date(event.endDate) : undefined
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location?.buildingName}</span>
            </div>
            {event.bitcoiners.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {event.bitcoiners.slice(0, 2).join(", ")}
                  {event.bitcoiners.length > 2 &&
                    ` +${event.bitcoiners.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
