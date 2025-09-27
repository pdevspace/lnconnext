"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { CalendarDay } from "@/types/calendar";
import DateCell from "./DateCell";
import React from "react";

interface MonthlyCalendarViewProps {
  calendarDays: CalendarDay[];
  selectDate: Date;
  selectedViewMode: string;
  setSelectDate: (date: Date) => void;
  daysInWeek: string[];
}

const MonthlyCalendarView = ({
  calendarDays,
  selectDate,
  selectedViewMode,
  setSelectDate,
  daysInWeek,
}: MonthlyCalendarViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-4">
        <Card>
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {daysInWeek.map((day) => (
                <div key={day} className="p-3 text-center font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className={cn("grid gap-px bg-border", "grid-cols-7")}>
              {calendarDays.map((day) => (
                <DateCell
                  key={day.date.toISOString()}
                  day={day}
                  isCurrentMonth={
                    selectedViewMode === "month"
                      ? day.date.getMonth() === selectDate.getMonth()
                      : true
                  }
                  onClick={() => setSelectDate(day.date)}
                  onAddEvent={(date) => console.log("Add event for:", date)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
