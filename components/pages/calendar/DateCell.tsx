"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isFuture, isPast } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { CalendarDay, CalendarEvent } from "@/types/calendar";
import { Clock, Heart, Plus, Star } from "lucide-react";
import React from "react";

interface DateCellProps {
  day: CalendarDay;
  isCurrentMonth?: boolean;
  onClick?: (day: CalendarDay) => void;
  onAddEvent?: (date: Date) => void;
  className?: string;
}

const availabilityColors: Record<CalendarDay["userAvailability"], string> = {
  free: "bg-green-50 border-green-200",
  busy: "bg-red-50 border-red-200",
  maybe: "bg-yellow-50 border-yellow-200",
};

const availabilityIcons: Record<
  CalendarDay["userAvailability"],
  React.ComponentType<{ className?: string }>
> = {
  free: Star,
  busy: Heart,
  maybe: Clock,
};

export default function DateCell({
  day,
  isCurrentMonth = true,
  onClick,
  onAddEvent,
  className,
}: DateCellProps) {
  const AvailabilityIcon = availabilityIcons[day.userAvailability];
  const isPastDate = isPast(day.date);
  const isFutureDate = isFuture(day.date);
  const hasMultipleEvents = day.events.length > 3;

  const handleCellClick = () => {
    onClick?.(day);
  };

  const handleAddEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEvent?.(day.date);
  };

  return (
    <div
      className={cn(
        "relative min-h-[120px] p-2 border border-border hover:bg-muted/50 transition-colors cursor-pointer",
        !isCurrentMonth && "bg-gray-100 text-gray-400",
        isCurrentMonth && availabilityColors[day.userAvailability],
        day.isToday && "ring-2 ring-primary",
        className
      )}
      onClick={handleCellClick}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-sm font-medium",
              day.isToday && "text-primary font-bold",
              isPastDate && "text-muted-foreground",
              !isCurrentMonth && "text-gray-400"
            )}
          >
            {day.date.getDate()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {day.userAvailability !== "free" && (
            <AvailabilityIcon className="h-3 w-3 text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddEvent}
            className="h-5 w-5 p-0 hover:bg-primary/10"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Event Indicators */}
      <div className="space-y-1">
        {day.events.slice(0, 3).map((event: CalendarEvent, index: number) => (
          <div
            key={event.id}
            className={cn(
              "h-6 rounded text-sm px-2 py-1 truncate cursor-pointer hover:opacity-80 transition-opacity",
              event.color,
              "text-white font-semibold shadow-sm"
            )}
            title={event.title}
          >
            {event.title}
          </div>
        ))}

        {hasMultipleEvents && (
          <div className="flex items-center justify-center mt-1">
            <Badge variant="secondary" className="text-xs">
              +{day.events.length - 3} more
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
