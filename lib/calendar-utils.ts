import { CalendarDay, CalendarEvent } from "@/types/calendar";

// Get the first day of the month
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Get the last day of the month
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// Get the first day of the week (Sunday)
export function getFirstDayOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

// Get the last day of the week (Saturday)
export function getLastDayOfWeek(date: Date): Date {
  const firstDay = getFirstDayOfWeek(date);
  return new Date(firstDay.getTime() + 6 * 24 * 60 * 60 * 1000);
}

// Generate calendar grid for a given month
export function generateMonthGrid(date: Date): Date[] {
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);

  // Get the first day of the week that contains the first day of the month
  const startDate = getFirstDayOfWeek(firstDay);

  // Get the last day of the week that contains the last day of the month
  const endDate = getLastDayOfWeek(lastDay);

  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Generate calendar grid for a given week
export function generateWeekGrid(date: Date): Date[] {
  const firstDay = getFirstDayOfWeek(date);
  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(firstDay);
    currentDate.setDate(firstDay.getDate() + i);
    dates.push(currentDate);
  }

  return dates;
}

// Generate calendar grid for 3 weeks starting from a given date
export function generateThreeWeekGrid(date: Date): Date[] {
  const firstDay = getFirstDayOfWeek(date);
  const dates: Date[] = [];

  for (let week = 0; week < 3; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(firstDay);
      currentDate.setDate(firstDay.getDate() + week * 7 + day);
      dates.push(currentDate);
    }
  }

  return dates;
}

// Generate weekend-only grid for a given month
export function generateWeekendGrid(date: Date): Date[] {
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);
  const dates: Date[] = [];

  const current = new Date(firstDay);

  while (current <= lastDay) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Sunday or Saturday
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Generate calendar days with events for a given date range
export function generateCalendarDays(
  dates: Date[],
  events: CalendarEvent[]
): CalendarDay[] {
  return dates.map(date => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      return eventStart <= dayEnd && eventEnd >= dayStart;
    });

    return {
      date: new Date(date),
      events: dayEvents,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isToday: isToday(date),
      userAvailability: getUserAvailability(date, dayEvents),
    };
  });
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if a date is in the past
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Check if a date is in the future
export function isFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
}

// Get user availability for a date based on events
export function getUserAvailability(
  date: Date,
  events: CalendarEvent[]
): "free" | "busy" | "maybe" {
  if (events.length === 0) return "free";

  const hasGoing = events.some(event => event.userStatus === "going");
  const hasMaybe = events.some(event => event.userStatus === "maybe");
  const hasBlocked = events.some(event => event.userStatus === "blocked");

  if (hasGoing || hasBlocked) return "busy";
  if (hasMaybe) return "maybe";
  return "free";
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Format date with day name
export function formatDateWithDay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Format time range
export function formatTimeRange(startDate: Date, endDate: Date): string {
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${startTime} - ${endTime}`;
}

// Get month name
export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Get week number
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Navigate to previous month
export function getPreviousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

// Navigate to next month
export function getNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

// Navigate to previous week
export function getPreviousWeek(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - 7);
  return newDate;
}

// Navigate to next week
export function getNextWeek(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 7);
  return newDate;
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

// Check if two dates are in the same week
export function isSameWeek(date1: Date, date2: Date): boolean {
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1 === week2 && date1.getFullYear() === date2.getFullYear();
}

// Check if two dates are in the same month
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Get the number of days between two dates
export function getDaysBetween(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Filter events by category
export function filterEventsByCategory(
  events: CalendarEvent[],
  category: string
): CalendarEvent[] {
  if (!category) return events;
  return events.filter(event => event.category === category);
}

// Filter events by location
export function filterEventsByLocation(
  events: CalendarEvent[],
  location: string
): CalendarEvent[] {
  if (!location) return events;
  return events.filter(event =>
    event.location.toLowerCase().includes(location.toLowerCase())
  );
}

// Filter events by user status
export function filterEventsByStatus(
  events: CalendarEvent[],
  status: string
): CalendarEvent[] {
  if (!status) return events;
  return events.filter(event => event.userStatus === status);
}

// Search events by title or description
export function searchEvents(
  events: CalendarEvent[],
  query: string
): CalendarEvent[] {
  if (!query) return events;
  const lowerQuery = query.toLowerCase();
  return events.filter(
    event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.speakers.some((speaker: string) =>
        speaker.toLowerCase().includes(lowerQuery)
      )
  );
}

// Get unique categories from events
export function getUniqueCategories(events: CalendarEvent[]): string[] {
  const categories = events.map(event => event.category);
  return Array.from(new Set(categories));
}

// Get unique locations from events
export function getUniqueLocations(events: CalendarEvent[]): string[] {
  const locations = events.map(event => event.location);
  return Array.from(new Set(locations));
}

// Check for event conflicts on a given date
export function getEventConflicts(events: CalendarEvent[]): CalendarEvent[][] {
  const conflicts: CalendarEvent[][] = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];

      if (doEventsConflict(event1, event2)) {
        conflicts.push([event1, event2]);
      }
    }
  }

  return conflicts;
}

// Check if two events conflict (overlap in time)
export function doEventsConflict(
  event1: CalendarEvent,
  event2: CalendarEvent
): boolean {
  const start1 = new Date(event1.startDate);
  const end1 = new Date(event1.endDate);
  const start2 = new Date(event2.startDate);
  const end2 = new Date(event2.endDate);

  return start1 < end2 && start2 < end1;
}

// Get the most popular events (by attendance)
export function getPopularEvents(
  events: CalendarEvent[],
  limit: number = 5
): CalendarEvent[] {
  return events
    .filter(event => event.currentAttendees && event.capacity)
    .sort((a, b) => {
      const ratioA = (a.currentAttendees || 0) / (a.capacity || 1);
      const ratioB = (b.currentAttendees || 0) / (b.capacity || 1);
      return ratioB - ratioA;
    })
    .slice(0, limit);
}

// Get upcoming events (next 30 days)
export function getUpcomingEvents(
  events: CalendarEvent[],
  days: number = 30
): CalendarEvent[] {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return events
    .filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= now && eventDate <= futureDate;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}
