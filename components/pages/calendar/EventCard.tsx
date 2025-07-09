"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeRange, isToday } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import {
  Clock,
  Coffee,
  ExternalLink,
  Gamepad2,
  Heart,
  MapPin,
  Monitor,
  Palette,
  Share2,
  Star,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
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

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Gaming Convention": Gamepad2,
  "Technology Conference": Monitor,
  "Art & Design": Palette,
  Esports: Trophy,
  Workshop: Wrench,
  Networking: Users,
  Meetup: Coffee,
  Gaming: Gamepad2,
};

const statusColors: Record<CalendarEvent["userStatus"], string> = {
  available: "border-green-200 bg-green-50",
  going: "border-blue-200 bg-blue-50",
  maybe: "border-yellow-200 bg-yellow-50",
  blocked: "border-red-200 bg-red-50",
};

const statusIcons: Record<
  CalendarEvent["userStatus"],
  React.ComponentType<{ className?: string }>
> = {
  available: Star,
  going: Heart,
  maybe: Clock,
  blocked: Clock,
};

export default function EventCard({
  event,
  variant = "compact",
  onClick,
  onStatusChange,
  className,
}: EventCardProps) {
  const CategoryIcon = categoryIcons[event.category] || Gamepad2;
  const StatusIcon = statusIcons[event.userStatus];
  const isEventToday = isToday(new Date(event.startDate));

  const handleCardClick = () => {
    onClick?.(event);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statuses: CalendarEvent["userStatus"][] = [
      "available",
      "going",
      "maybe",
      "blocked",
    ];
    const currentIndex = statuses.indexOf(event.userStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange?.(event.id, nextStatus);
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

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
          statusColors[event.userStatus],
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
                <CategoryIcon className="h-3 w-3 text-muted-foreground" />
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

            <div className="flex flex-col items-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStatusClick}
                className="h-6 w-6 p-0"
              >
                <StatusIcon className="h-3 w-3" />
              </Button>

              {event.price !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {event.price === 0 ? "Free" : `฿${event.price}`}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4",
        statusColors[event.userStatus],
        event.color.replace("bg-", "border-l-"),
        isEventToday && "ring-2 ring-blue-500",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-base">{event.title}</h3>
                {isEventToday && (
                  <Badge variant="default" className="text-xs">
                    Today
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStatusClick}
                className="h-8 w-8 p-0"
              >
                <StatusIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatTimeRange(
                  new Date(event.startDate),
                  new Date(event.endDate)
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{event.location}</span>
            </div>

            {event.speakers.length > 0 && (
              <div className="flex items-center gap-2 col-span-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {event.speakers.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              {event.price !== undefined && (
                <Badge variant="secondary">
                  {event.price === 0
                    ? "Free"
                    : `฿${event.price.toLocaleString()}`}
                </Badge>
              )}

              {event.capacity && event.currentAttendees && (
                <Badge variant="outline" className="text-xs">
                  {event.currentAttendees.toLocaleString()}/
                  {event.capacity.toLocaleString()}
                </Badge>
              )}
            </div>

            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
