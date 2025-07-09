export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  category: string;
  location: string;
  speakers: string[];
  userStatus: "available" | "going" | "maybe" | "blocked";
  color: string;
  isMultiDay: boolean;
  description: string;
  price?: number;
  capacity?: number;
  currentAttendees?: number;
  image?: string;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isWeekend: boolean;
  isToday: boolean;
  userAvailability: "free" | "busy" | "maybe";
}

export type ViewMode = "month" | "week" | "daily";

export interface FilterState {
  search: string;
  categories: string[];
  locations: string[];
  statuses: string[];
}
