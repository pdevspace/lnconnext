"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents } from "@/data/EventService";
import {
  generateCalendarDays,
  generateMonthGrid,
  getMonthName,
  getNextMonth,
  getNextWeek,
  getPreviousMonth,
  getPreviousWeek,
  searchEvents,
  daysInWeek,
} from "@/utils/calendar-utils";
import { cn } from "@/utils/utils";
import { CalendarDay, FilterState, ViewMode } from "@/types/calendar";
import { Event } from "@/types/event";
import { addDays, addMonths, isSameDay, isToday as isTodayFn } from "date-fns";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
// import CalendarFilters from "./CalendarFilters";
import DateCell from "./DateCell";
import EventDetails from "./EventDetails";
import DailyCalendarView from "./DailyCalendarView";
import MonthlyCalendarView from "./MonthlyCalendarView";

interface CalendarPageProps {
  initialDate?: Date;
  viewMode?: ViewMode;
}

export default function CalendarPage({
  initialDate = new Date(),
  viewMode = "month",
}: CalendarPageProps) {
  const router = useRouter();
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode>(viewMode);
  const [selectDate, setSelectDate] = useState<Date>(initialDate);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    locations: [],
    statuses: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const bitcoinEvents: Event[] = getAllEvents();

  const [events, setEvents] = useState<Event[]>(bitcoinEvents);

  // Generate calendar grid based on view mode
  const calendarDates = useMemo(() => {
    return generateMonthGrid(selectDate);
  }, [selectDate, selectedViewMode]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (filters.search) {
      filtered = searchEvents(filtered, filters.search);
    }

    return filtered;
  }, [events, filters]);

  // Generate calendar days with filtered events
  const calendarDays = useMemo(() => {
    return generateCalendarDays(calendarDates, filteredEvents);
  }, [calendarDates, filteredEvents]);

  // Generate daily list from today to 6 months ahead
  const dailyList = useMemo(() => {
    const start = new Date();
    const end = addMonths(start, 6);
    const days = [];
    let d = start;
    while (d <= end) {
      days.push(new Date(d));
      d = addDays(d, 1);
    }
    return days;
  }, []);

  const selectEvent = useMemo(
    () => filteredEvents.filter((ev) => isSameDay(ev.startDate, selectDate)),
    [filteredEvents, selectDate]
  );

  // Handle navigation
  const handlePrevious = () => {
    if (selectedViewMode === "month") {
      setSelectDate(getPreviousMonth(selectDate));
    } else {
      setSelectDate(getPreviousWeek(selectDate));
    }
  };

  const handleNext = () => {
    if (selectedViewMode === "month") {
      setSelectDate(getNextMonth(selectDate));
    } else {
      setSelectDate(getNextWeek(selectDate));
    }
  };

  const handleToday = () => {
    setSelectDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectDate(day.date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card fixed top-[70px] left-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center gap-4 flex-wrap justify-between">
            {/* Left: Calendar title and view mode toggle */}
            <div className="flex items-center gap-4 min-w-fit">
              <h1 className="text-xl font-bold">Calendar</h1>
              <Tabs
                value={selectedViewMode}
                onValueChange={(value) =>
                  setSelectedViewMode(value as ViewMode)
                }
              >
                <TabsList className="grid w-auto grid-cols-2 h-8">
                  <TabsTrigger value="month" className="text-xs">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="text-xs">
                    Daily
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {/* Right: Navigation Controls and Filter Button */}
            <div className="flex items-center gap-2 min-w-fit">
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          {/* Date Display */}
          <div className="mt-1">
            <h2 className="text-base font-semibold text-muted-foreground">
              {getMonthName(selectDate)}
            </h2>
          </div>
        </div>
        {/* Floating Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20">
            <div className="bg-white rounded-lg shadow-lg p-6 mt-16 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                <span className="text-xl">×</span>
              </button>
              {/* <CalendarFilters events={events} onFiltersChange={setFilters} /> */}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 mt-[130px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-screen overflow-y-auto lg:col-span-3">
            {selectedViewMode === "daily" ? (
              <DailyCalendarView
                dailyList={dailyList}
                filteredEvents={filteredEvents}
                selectDate={selectDate}
                setSelectDate={setSelectDate}
              />
            ) : (
              <MonthlyCalendarView
                calendarDays={calendarDays}
                selectDate={selectDate}
                selectedViewMode={selectedViewMode}
                setSelectDate={setSelectDate}
                daysInWeek={daysInWeek}
              />
            )}
          </div>
          <div
            className={cn(
              "space-y-6",
              // On large screens: sticky left sidebar
              "hidden md:block",
              "md:col-span-1",
              "md:sticky md:top-[130px]"
            )}
            style={{
              maxWidth: "100vw",
            }}
          >
            <EventDetails selectDate={selectDate} selectEvent={selectEvent} />
          </div>
          {/* Bottom bar for md and below */}
          <div
            className={cn(
              "block md:hidden",
              "fixed bottom-0 left-0 right-0 z-50 w-full px-2 pb-2 pointer-events-none"
            )}
            style={{
              maxWidth: "100vw",
            }}
          >
            <EventDetails selectDate={selectDate} selectEvent={selectEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}
