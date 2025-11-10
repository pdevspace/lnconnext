# Event Detail Page Design Specification

## Overview

This document provides comprehensive design specifications for the Event Detail Page feature in the LNConnext platform. The design follows the established design system patterns and integrates with the existing architecture while providing comprehensive event information display and interaction functionality.

## Prerequisites

### Requirement Understanding

- **MANDATORY**: Before implementing any feature, ai must read and understand `ai/01-requirements/features/event-management.md`
- All design decisions must trace back to the requirements specification
- Implementation should align with the functional and non-functional requirements
- Technical constraints and acceptance criteria must be considered

## Traceability

### Source Requirements

- **Primary Source**: `ai/01-requirements/features/event-management.md`
- **Secondary Sources**:
  - `ai/01-requirements/overall-requirements.md` - Overall project requirements
  - `ai/01-requirements/non-functional-requirements.md` - Technical constraints

### Target Implementation Files

- `src/app/event/[eventId]/page.tsx` - Event detail route
- `src/components/pages/event/EventPage.tsx` - Main event page component
- `src/components/pages/event/EventComponent.tsx` - Event display component
- `src/data/EventService.ts` - Event data service
- `src/types/event.ts` - Event type definitions
- `src/models/event.ts` - Backend event models
- `src/utils/frontendValidators.ts` - Frontend validation
- `src/utils/backendValidators.ts` - Backend validation

### Target Test Files

- `src/components/pages/event/__tests__/EventPage.test.tsx`
- `src/components/pages/event/__tests__/EventComponent.test.tsx`
- `src/data/__tests__/EventService.test.ts`

## Database Design

### Event Collection Schema

```typescript
interface Event {
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
	website: Website[]
	price: number
	register?: Website
	createdAt: Date
	updatedAt: Date
}

interface Location {
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

interface EventSection {
	id: string
	sectionName: string
	startTime: Date
	endTime: Date
	spot: string
	bitcoiners: Bitcoiner[]
	description?: string
}

interface Bitcoiner {
	id: string
	name: string
	socialMedia: SocialMedia[]
	avatar?: string
	bio?: string
	expertise?: string[]
}

interface SocialMedia {
	id: string
	displayText: string
	username: string
	platform: string
	urlLink: string
	ownerId: string
	ownerType: 'bitcoiner' | 'organizer'
}

interface Website {
	id: string
	url: string
	type: 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'other'
	displayText?: string
}
```

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

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

  // Relations
  organizerId      String         @db.ObjectId

  locationId       String?        @db.ObjectId
  location         Location?      @relation(fields: [locationId], references: [id], onDelete: SetNull)

  sections         EventSection[]
  bitcoiners       Bitcoiner[]    @relation("EventBitcoiners")
  websites         Website[]      @relation("EventWebsites")

  registerId       String?        @db.ObjectId
  register         Website?       @relation("EventRegister", fields: [registerId], references: [id], onDelete: SetNull)

  @@map("events")
}

model Location {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  buildingName  String
  address       String
  city          String
  country       String
  googleMapsUrl String
  coordinates   Json?     // { lat: number, lng: number }
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  events        Event[]

  @@map("locations")
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

  // Relations
  eventId     String    @db.ObjectId
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  bitcoiners  Bitcoiner[] @relation("SectionBitcoiners")

  @@map("event_sections")
}

model Bitcoiner {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  bio         String?
  avatar      String?
  expertise   String[]
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  socialMedia SocialMedia[] @relation("BitcoinerSocialMedia")
  events      Event[]       @relation("EventBitcoiners")
  sections    EventSection[] @relation("SectionBitcoiners")

  @@map("bitcoiners")
}

model SocialMedia {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  displayText String
  username    String
  platform    String
  urlLink     String
  ownerId     String    @db.ObjectId
  ownerType   String    // 'bitcoiner' or 'organizer'
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("social_media")
}

model Website {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  url         String
  type        String    // 'facebook', 'youtube', 'twitter', 'linkedin', 'instagram', 'other'
  displayText String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  eventId     String?   @db.ObjectId
  event       Event?    @relation("EventWebsites", fields: [eventId], references: [id], onDelete: Cascade)

  registerEventId String? @db.ObjectId
  registerEvent   Event?  @relation("EventRegister", fields: [registerEventId], references: [id], onDelete: SetNull)

  @@map("websites")
}
```

## Frontend Service Design

### Event Service Architecture

```typescript
// src/services/EventService.ts
export class EventService {
	// Get event by ID with all related data
	static async getEventById(eventId: string): Promise<Event | null> {
		// Implementation with Prisma queries
	}

	// Get events with filtering and pagination
	static async getEvents(filters?: EventFilters): Promise<Event[]> {
		// Implementation with Prisma queries
	}

	// Search events by query
	static async searchEvents(query: string): Promise<Event[]> {
		// Implementation with Prisma queries
	}

	// Get events by organizer
	static async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
		// Implementation with Prisma queries
	}

	// Get events by speaker
	static async getEventsBySpeaker(speakerId: string): Promise<Event[]> {
		// Implementation with Prisma queries
	}

	// Get upcoming events
	static async getUpcomingEvents(limit?: number): Promise<Event[]> {
		// Implementation with Prisma queries
	}

	// Get past events
	static async getPastEvents(limit?: number): Promise<Event[]> {
		// Implementation with Prisma queries
	}
}

// Event filters interface
interface EventFilters {
	search?: string
	type?: 'meetup' | 'conference' | 'course'
	status?: 'upcoming' | 'past' | 'live'
	organizerId?: string
	speakerId?: string
	dateFrom?: Date
	dateTo?: Date
	limit?: number
	offset?: number
}
```

### React Hooks for API Integration

```typescript
// src/hooks/useEvent.ts
export function useEvent(eventId: string): UseEventResult {
	// Hook for fetching single event with loading and error states
	// Returns: { event, loading, error, refetch }
}

export function useEvents(filters: EventFilters = {}): UseEventsResult {
	// Hook for fetching events list with filtering
	// Returns: { events, loading, error, refetch }
}

export function useUpcomingEvents(limit: number = 10): UseUpcomingEventsResult {
	// Hook for fetching upcoming events
	// Returns: { events, loading, error, refetch }
}

export function usePastEvents(limit: number = 10): UsePastEventsResult {
	// Hook for fetching past events
	// Returns: { events, loading, error, refetch }
}

// Hook result interfaces
interface UseEventResult {
	event: Event | null
	loading: boolean
	error: string | null
	refetch: () => void
}

interface UseEventsResult {
	events: Event[]
	loading: boolean
	error: string | null
	refetch: () => void
}

interface UseUpcomingEventsResult {
	events: Event[]
	loading: boolean
	error: string | null
	refetch: () => void
}

interface UsePastEventsResult {
	events: Event[]
	loading: boolean
	error: string | null
	refetch: () => void
}
```

### API Endpoints Design

```typescript
// Action-based API endpoints (POST only)
POST /api/event/get
Payload: { eventId: string }
Response: { success: boolean; data?: Event; error?: string }

POST /api/event/list
Payload: { filters?: EventFilters }
Response: { success: boolean; data?: Event[]; error?: string }

POST /api/event/search
Payload: { query: string; filters?: EventFilters }
Response: { success: boolean; data?: Event[]; error?: string }

POST /api/event/by-organizer
Payload: { organizerId: string; filters?: EventFilters }
Response: { success: boolean; data?: Event[]; error?: string }

POST /api/event/by-speaker
Payload: { speakerId: string; filters?: EventFilters }
Response: { success: boolean; data?: Event[]; error?: string }

POST /api/event/upcoming
Payload: { limit?: number }
Response: { success: boolean; data?: Event[]; error?: string }

POST /api/event/past
Payload: { limit?: number }
Response: { success: boolean; data?: Event[]; error?: string }
```

## Component Architecture

### EventPage Component

```typescript
// src/components/pages/event/EventPage.tsx
interface EventPageProps {
  eventId: string;
}

export function EventPage({ eventId }: EventPageProps) {
  const { event, loading, error } = useEvent(eventId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 top-16 overflow-y-auto bg-white dark:bg-gray-900"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="container mx-auto px-4 py-8">
        {loading && <LoadingState />}
        {error && <ErrorState error={error} />}
        {event && <EventComponent event={event} />}
      </div>
    </div>
  );
}
```

### EventComponent Structure

```typescript
// src/components/pages/event/EventComponent.tsx
interface EventComponentProps {
  event: Event;
}

export function EventComponent({ event }: EventComponentProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column (30%) */}
        <div className="lg:col-span-4 space-y-6">
          <EventImage event={event} />
          <EventActionButtons event={event} />
          <EventOriginalLinks event={event} />
          <EventSpeakers event={event} />
        </div>

        {/* Right Column (70%) */}
        <div className="lg:col-span-8 space-y-6">
          <EventHeader event={event} />
          <EventOrganizer event={event} />
          <EventDatePeriod event={event} />
          <EventLocation event={event} />
          <EventDescription event={event} />
          <EventSchedule event={event} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        <EventImage event={event} />
        <EventHeader event={event} />
        <EventOrganizer event={event} />
        <EventActionButtons event={event} />
        <EventLocation event={event} />
        <EventDescription event={event} />
        <EventSchedule event={event} />
        <EventSpeakers event={event} />
      </div>
    </div>
  );
}
```

### Sub-Components Design

#### EventImage Component

```typescript
interface EventImageProps {
  event: Event;
}

export function EventImage({ event }: EventImageProps) {
  return (
    <div className="aspect-square rounded-lg overflow-hidden">
      <Image
        src={event.images[0] || '/images/default-event.jpg'}
        alt={event.name}
        width={400}
        height={400}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}
```

#### EventActionButtons Component

```typescript
interface EventActionButtonsProps {
  event: Event;
}

export function EventActionButtons({ event }: EventActionButtonsProps) {
  const handleAddToCalendar = () => {
    // Generate Google Calendar link
    const calendarUrl = generateCalendarUrl(event);
    window.open(calendarUrl, '_blank');
  };

  const handleRegister = () => {
    if (event.register) {
      window.open(event.register.url, '_blank');
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {event.register && (
        <Button onClick={handleRegister} className="w-full">
          <Calendar className="w-4 h-4 mr-2" />
          Register
        </Button>
      )}
      <Button onClick={handleAddToCalendar} variant="outline" className="w-full">
        <Calendar className="w-4 h-4 mr-2" />
        Add to Calendar
      </Button>
    </div>
  );
}
```

#### EventOrganizer Component

```typescript
interface EventOrganizerProps {
  event: Event;
}

export function EventOrganizer({ event }: EventOrganizerProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {event.organizer.avatar ? (
            <Image
              src={event.organizer.avatar}
              alt={event.organizer.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{event.organizer.name}</h3>
            <p className="text-sm text-gray-500">Organizer</p>
          </div>
        </div>
        <SocialMediaBox socialMedia={event.organizer.socialMedia} />
      </div>
    </Card>
  );
}
```

#### EventSchedule Component

```typescript
interface EventScheduleProps {
  event: Event;
}

export function EventSchedule({ event }: EventScheduleProps) {
  if (!event.sections || event.sections.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
      <div className="space-y-4">
        {event.sections.map((section) => (
          <div key={section.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{section.sectionName}</h3>
              <span className="text-sm text-gray-500">
                {formatTime(section.startTime)} - {formatTime(section.endTime)}
              </span>
            </div>
            {section.spot && (
              <p className="text-sm text-gray-600 mt-1">📍 {section.spot}</p>
            )}
            {section.speakers && section.speakers.length > 0 && (
              <div className="mt-2">
                <SpeakerBox speakers={section.speakers} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
```

## Data Flow Architecture

### Frontend Data Flow

1. **Route Parameter**: Extract `eventId` from URL
2. **Data Fetching**: Call `EventService.getEventById(eventId)`
3. **State Management**: Store event data in component state
4. **UI Rendering**: Render event components with data
5. **User Interactions**: Handle user actions (calendar, register, share)

### Backend Data Flow

1. **API Request**: Receive POST request with eventId
2. **Validation**: Validate eventId parameter
3. **Database Query**: Query MongoDB with Prisma
4. **Data Processing**: Process and format event data
5. **Response**: Return formatted event data

## Validation Architecture

### Frontend Validation

```typescript
// src/utils/frontendValidators.ts
export const validateEventId = (eventId: string): boolean => {
	return eventId && eventId.length > 0
}

export const validateEventData = (event: Event): ValidationResult => {
	// Validate event data structure
	// Check required fields
	// Validate date formats
	// Validate URL formats
}
```

### Backend Validation

```typescript
// src/utils/backendValidators.ts
export const validateEventApiRequest = (body: any): ApiValidationResult => {
	// Validate request body structure
	// Check eventId format
	// Validate required fields
	// Sanitize input data
}
```

## Performance Considerations

### Image Optimization

- **Next.js Image**: Automatic optimization and lazy loading
- **Priority Loading**: Event image loads with priority
- **Responsive Sizing**: Appropriate sizes for different viewports
- **Fallback Images**: Graceful handling of missing images

### Data Loading

- **Server-Side Rendering**: Initial page loads with SSR
- **Client-Side Caching**: React Query for client-side data management
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Boundaries**: Graceful error handling

### Caching Strategy

```typescript
// lib/cache.ts
export const getCachedEvent = unstable_cache(
	async (eventId: string) => {
		return EventService.getEventById(eventId)
	},
	['event'],
	{ revalidate: 300 } // 5 minutes
)
```

## Accessibility Features

### ARIA Labels

- **Action Buttons**: Proper labeling for screen readers
- **Event Information**: Clear status communication
- **Navigation Links**: Descriptive link text

### Keyboard Navigation

- **Tab Order**: Logical tab sequence through interface
- **Button Focus**: Visible focus states for all interactive elements
- **Keyboard Shortcuts**: Standard keyboard navigation support

### Visual Accessibility

- **Color Contrast**: Sufficient contrast for all text and backgrounds
- **Status Indicators**: Color and text for status communication
- **Icon Usage**: Icons paired with text labels where appropriate

## Responsive Design

### Desktop Layout (1024px+)

- **Two-Column Layout**: Left (30%) and right (70%) columns
- **Synchronized Scrolling**: Both columns scroll together
- **Fixed Sidebar**: Action buttons and speakers in left column

### Mobile Layout (< 1024px)

- **Single Column**: Stacked layout from top to bottom
- **Sticky Elements**: Event name and action buttons stay visible
- **Touch-Friendly**: Larger touch targets for mobile interaction

## Error Handling

### Error States

- **Loading State**: Spinner with loading message
- **Not Found**: Clear error message with navigation back
- **Network Error**: Retry mechanism with error message
- **Validation Error**: Form validation with specific error messages

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
export class EventErrorBoundary extends React.Component {
	// Handle component errors gracefully
	// Display user-friendly error messages
	// Provide recovery options
}
```

## Testing Strategy

### Unit Tests

- **Component Tests**: React Testing Library for UI components
- **Hook Tests**: Custom hook testing
- **Utility Tests**: Pure function testing
- **Validation Tests**: Schema testing

### Integration Tests

- **API Tests**: API route testing
- **Database Tests**: Prisma integration testing
- **E2E Tests**: Full user flow testing

### Test Structure

```
__tests__/
├── components/
│   └── event/
│       ├── EventPage.test.tsx
│       ├── EventComponent.test.tsx
│       └── EventImage.test.tsx
├── api/
│   └── event/
│       └── get.test.ts
├── services/
│   └── EventService.test.ts
└── utils/
    └── eventValidators.test.ts
```

## Security Considerations

### Input Validation

- **Client-Side**: Form validation with real-time feedback
- **Server-Side**: API route validation
- **Database**: Prisma type safety
- **XSS Prevention**: Input sanitization

### Data Protection

- **SQL Injection**: Prisma ORM prevents injection attacks
- **CSRF Protection**: Next.js built-in CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse

## Future Enhancements

### Advanced Features

- **Real-time Updates**: WebSocket integration for live event updates
- **Event Analytics**: Usage analytics and reporting
- **Social Features**: Comments and discussions
- **Recommendations**: AI-powered event recommendations

### Integration Features

- **Calendar Sync**: Multiple calendar provider support
- **Social Sharing**: Enhanced social media sharing
- **Notifications**: Push notifications for event updates
- **Offline Support**: PWA offline functionality

## Conclusion

This design specification provides a comprehensive blueprint for implementing the Event Detail Page feature with:

- ✅ **Complete Database Design**: MongoDB schema with Prisma ORM
- ✅ **Frontend Service Architecture**: Action-based API design
- ✅ **Component Architecture**: Modular, reusable components
- ✅ **Responsive Design**: Mobile-first approach with proper breakpoints
- ✅ **Performance Optimization**: Image optimization and caching strategies
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Testing Strategy**: Complete testing coverage
- ✅ **Security**: Input validation and data protection
- ✅ **Future Ready**: Extensible architecture for enhancements

The design ensures scalability, maintainability, and user experience while following modern web development best practices and the established LNConnext design system.

---

**Last Updated**: 2024-12-19
**Status**: Design Complete
**Next Phase**: Implementation
