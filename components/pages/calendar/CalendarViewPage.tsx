"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents } from "@/data/EventService";
import {
  generateCalendarDays,
  generateMonthGrid,
  generateWeekGrid,
  getMonthName,
  getNextMonth,
  getNextWeek,
  getPreviousMonth,
  getPreviousWeek,
  searchEvents,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import {
  CalendarDay,
  CalendarEvent,
  FilterState,
  ViewMode,
} from "@/types/calendar";
import { addDays, addMonths, isSameDay, isToday as isTodayFn } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CalendarFilters from "./CalendarFilters";
import DateCell from "./DateCell";
import EventCard from "./EventCard";

interface CalendarViewPageProps {
  initialDate?: Date;
  viewMode?: ViewMode;
}

export default function CalendarViewPage({
  initialDate = new Date(),
  viewMode = "month",
}: CalendarViewPageProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode>("daily");
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    locations: [],
    statuses: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  // Convert Bitcoin events to CalendarEvent format
  const bitcoinCalendarEvents: CalendarEvent[] = getAllEvents().map(
    (event) => ({
      id: event.id,
      title: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location?.buildingName ?? "No location",
      category: event.category,
      speakers: event.speakers?.map((speaker) => speaker.name) ?? [],
      userStatus: "available" as const,
      color: "bg-orange-500",
      isMultiDay:
        event.startDate.toDateString() !== event.endDate.toDateString(),
      currentAttendees: event.currentAttendees || 0,
      capacity: event.capacity || 0,
      price: event.price || 0,
      image: event.images?.[0] || "",
    })
  );

  const [events, setEvents] = useState<CalendarEvent[]>(bitcoinCalendarEvents);

  // Generate calendar grid based on view mode
  const calendarDates = useMemo(() => {
    switch (selectedViewMode) {
      case "month":
        return generateMonthGrid(currentDate);
      case "week":
        return generateWeekGrid(currentDate);
      default:
        return generateMonthGrid(currentDate);
    }
  }, [currentDate, selectedViewMode]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (filters.search) {
      filtered = searchEvents(filtered, filters.search);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((event) =>
        filters.categories.includes(event.category)
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((event) =>
        filters.locations.some((location) =>
          event.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((event) =>
        filters.statuses.includes(event.userStatus)
      );
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

  // Selected day for daily view
  const [selectedDayDate, setSelectedDayDate] = useState<Date>(new Date());
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter((ev) =>
      isSameDay(ev.startDate, selectedDayDate)
    );
  }, [filteredEvents, selectedDayDate]);

  // Handle navigation
  const handlePrevious = () => {
    if (selectedViewMode === "month") {
      setCurrentDate(getPreviousMonth(currentDate));
    } else {
      setCurrentDate(getPreviousWeek(currentDate));
    }
  };

  const handleNext = () => {
    if (selectedViewMode === "month") {
      setCurrentDate(getNextMonth(currentDate));
    } else {
      setCurrentDate(getNextWeek(currentDate));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handle event status change
  const handleEventStatusChange = (
    eventId: string,
    status: CalendarEvent["userStatus"]
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, userStatus: status } : event
      )
    );
  };

  // Handle day selection
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    router.push(`/event/${event.id}`);
  };

  // Remove popularEvents, upcomingEvents, conflicts, and their usage

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
                <TabsList className="grid w-auto grid-cols-3 h-8">
                  <TabsTrigger value="month" className="text-xs">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs">
                    Week
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
              {getMonthName(currentDate)}
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
              <CalendarFilters events={events} onFiltersChange={setFilters} />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 mt-[130px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div
            className={
              selectedViewMode === "daily" ? "lg:col-span-3" : "lg:col-span-3"
            }
          >
            {selectedViewMode === "daily" ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {dailyList.map((date) => {
                      const dayEvents = filteredEvents.filter((ev) =>
                        isSameDay(ev.startDate, date)
                      );
                      const isSelected = isSameDay(date, selectedDayDate);
                      return (
                        <div
                          key={date.toISOString()}
                          className={cn(
                            "flex items-center py-3 px-2 cursor-pointer transition",
                            isSelected
                              ? "bg-blue-50"
                              : "bg-white hover:bg-gray-50"
                          )}
                          onClick={() => setSelectedDayDate(date)}
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
                              <span className="text-gray-400 text-sm">
                                No events
                              </span>
                            )}
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-medium shadow"
                              >
                                {event.title}
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
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-4">
                  <Card>
                    <CardContent className="p-0">
                      {/* Calendar Header */}
                      <div className="grid grid-cols-7 border-b bg-muted/30">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <div
                              key={day}
                              className="p-3 text-center font-medium text-sm"
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>
                      {/* Calendar Grid */}
                      <div
                        className={cn("grid gap-px bg-border", "grid-cols-7")}
                      >
                        {calendarDays.map((day, index) => (
                          <DateCell
                            key={day.date.toISOString()}
                            day={day}
                            isCurrentMonth={
                              selectedViewMode === "month"
                                ? day.date.getMonth() === currentDate.getMonth()
                                : true
                            }
                            onClick={handleDayClick}
                            onAddEvent={(date) =>
                              console.log("Add event for:", date)
                            }
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
          {/* Sidebar: Selected Day Events (always visible) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedViewMode === "daily"
                    ? selectedDayDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : selectedDay
                      ? selectedDay.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No day selected"}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {selectedViewMode === "daily"
                      ? selectedDayEvents.length
                      : selectedDay?.events.length || 0}{" "}
                    events
                  </Badge>
                  {(selectedViewMode === "daily"
                    ? selectedDayDate.getDay() === 0 ||
                      selectedDayDate.getDay() === 6
                    : selectedDay?.isWeekend) && (
                    <Badge variant="secondary">Weekend</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  selectedViewMode === "daily"
                    ? selectedDayEvents.length > 0
                    : selectedDay && selectedDay.events.length > 0
                ) ? (
                  (selectedViewMode === "daily"
                    ? selectedDayEvents
                    : selectedDay?.events || []
                  ).map((event: CalendarEvent) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      onClick={handleEventClick}
                      onStatusChange={handleEventStatusChange}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No events scheduled</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
