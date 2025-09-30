import { CalendarDay } from "@/types/calendar";
import { Bitcoiner } from "@/types/event";
import { Event } from "@/types/event";

export const daysInWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  events: Event[]
): CalendarDay[] {
  return dates.map(date => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
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
export function formatTimeRange(startDate: Date, endDate?: Date): string {
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  if (!endDate) {
    return startTime;
  }
  
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

// Search events by title or description
export function searchEvents(
  events: Event[],
  query: string
): Event[] {
  if (!query) return events;
  const lowerQuery = query.toLowerCase();
  return events.filter(
    event =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.bitcoiners.some((bitcoiner: Bitcoiner) =>
        bitcoiner.name.toLowerCase().includes(lowerQuery)
      )
  );
}

// Check for event conflicts on a given date
export function getEventConflicts(events: Event[]): Event[][] {
  const conflicts: Event[][] = [];

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
  event1: Event,
  event2: Event
): boolean {
  const start1 = new Date(event1.startDate);
  const end1 = event1.endDate ? new Date(event1.endDate) : start1;
  const start2 = new Date(event2.startDate);
  const end2 = event2.endDate ? new Date(event2.endDate) : start2;

  return start1 < end2 && start2 < end1;
}

// Get upcoming events (next 30 days)
export function getUpcomingEvents(
  events: Event[],
  days: number = 30
): Event[] {
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
