# Event Management Implementation

## Overview

Complete implementation of the Event Management feature including database models, API endpoints, frontend components, and calendar integration.

## Database Implementation

### Prisma Schema

```prisma
model Event {
  id               String         @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  description      String
  eventSeriesName  String?
  startDate        DateTime
  endDate          DateTime?
  price            Float          @default(0)
  images           String[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  organizerId      String         @db.ObjectId
  organizer        Organizer      @relation(fields: [organizerId], references: [id], onDelete: Cascade)

  locationId       String?        @db.ObjectId
  location         Location?      @relation(fields: [locationId], references: [id], onDelete: Restrict)

  sections         EventSection[]
  eventBitcoiners  EventBitcoiner[]
  websites         Website[]      @relation("EventWebsites")

  @@map("events")
}

model EventSection {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  sectionName String
  startTime   DateTime
  endTime     DateTime
  spot        String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  eventId     String    @db.ObjectId
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  sectionBitcoiners SectionBitcoiner[]

  @@map("event_sections")
}
```

## Backend Implementation

### Service Layer (`src/services/EventService.ts`)

- `getEventById(id: string)` - Fetch single event
- `getEvents(filters: EventFilters)` - Fetch all with filtering
- `getUpcomingEvents(limit: number)` - Fetch upcoming events
- `getPastEvents(limit: number)` - Fetch past events
- `searchEvents(query: string, filters: EventFilters)` - Search events

### API Routes

- `POST /api/event/get` - Get single event
- `POST /api/event/list` - List events with filters
- `POST /api/event/upcoming` - Get upcoming events
- `POST /api/event/past` - Get past events
- `POST /api/event/search` - Search events

## Frontend Implementation

### Types (`src/types/event.ts`)

```typescript
export interface Event {
	id: string
	name: string
	description: string
	organizerId: string
	eventSeriesName?: string
	location?: Location
	sections: EventSection[]
	startDate: Date
	endDate?: Date
	bitcoiners: Bitcoiner[]
	images: string[]
	websites: Website[]
	price: number
	register?: Website
	createdAt: Date
	updatedAt: Date
}

export interface EventSection {
	id: string
	sectionName: string
	startTime: Date
	endTime: Date
	spot: string
	description?: string
	bitcoiners: Bitcoiner[]
}

export interface Location {
	id: string
	buildingName: string
	address: string
	city: string
	country: string
	googleMapsUrl: string
	coordinates?: {
		lat: number
		lng: number
	}
}
```

### Custom Hooks (`src/hooks/useEvent.ts`)

- `useEvents(filters)` - Fetch all events with filtering
- `useEvent(id)` - Fetch single event
- `useUpcomingEvents(limit)` - Fetch upcoming events
- `usePastEvents(limit)` - Fetch past events

### UI Components

- `EventCard` - Reusable card component
- `EventDetailPage` - Individual event page
- `EventListPage` - Main listing page
- `CalendarPage` - Calendar view
- `MonthlyCalendarView` - Monthly calendar
- `DailyCalendarView` - Daily calendar
- `EventDetails` - Event details modal

## Key Features

### Event Display

- Event cards with images
- Date and time information
- Location details
- Speaker information
- Price display

### Calendar Integration

- Monthly calendar view
- Daily calendar view
- Event indicators on dates
- Event details modal
- Navigation between months

### Search and Filtering

- Search by event name
- Search by speaker names
- Filter by date range
- Filter by organizer
- Filter by location

### Date Handling

- Proper date conversion from API
- Timezone handling
- Date formatting utilities
- Calendar navigation

## Implementation Status

✅ Database schema defined
✅ Backend service layer implemented
✅ API routes created
✅ Frontend types defined
✅ Custom hooks implemented
✅ UI components built
✅ Calendar integration complete
✅ Date handling implemented
✅ Search and filtering added
✅ Responsive design applied
