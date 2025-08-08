"use client";
import { Card, CardContent } from "@/components/ui/card";
import { isSameDay, isToday as isTodayFn } from "date-fns";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import React from "react";

interface DailyCalendarViewProps {
  dailyList: Date[];
  filteredEvents: Event[];
  selectDate: Date;
  setSelectDate: (date: Date) => void;
}

const DailyCalendarView = ({
  dailyList,
  filteredEvents,
  selectDate,
  setSelectDate,
}: DailyCalendarViewProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {dailyList.map((date) => {
            const dayEvents = filteredEvents.filter((ev) =>
              isSameDay(ev.startDate, date)
            );
            const isSelected = isSameDay(date, selectDate);
            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "flex items-center py-3 px-2 cursor-pointer transition",
                  isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                )}
                onClick={() => setSelectDate(date)}
              >
                <div
                  className={cn(
                    "w-48 font-semibold",
                    isSelected ? "text-blue-700" : "text-gray-700"
                  )}
                >
                  {date.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {dayEvents.length === 0 && (
                    <span className="text-gray-400 text-sm">No events</span>
                  )}
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-medium shadow"
                    >
                      {`${event.name} by ${event.organizer}`}
                    </div>
                  ))}
                </div>
                {isTodayFn(date) && (
                  <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCalendarView;
