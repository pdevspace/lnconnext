# Event Management Design Specification

## Overview

The Event Management feature allows users to view, search, and manage Bitcoin community events. Events include detailed information about speakers, schedules, locations, and registration details.

## Feature Components

### 1. Event List Page (`/event`)

**Purpose**: Display all events with filtering, search, and categorization.

**Design Elements**:

- Header with "Events" title
- Search bar with real-time filtering
- Filter options (Upcoming, Past, By Organizer, By Speaker)
- Grid layout of Event cards
- Loading and empty states
- Pagination for large datasets

**User Interactions**:

- Search by event name, description, or speaker names
- Filter by date range, organizer, or speaker
- Click on event card to view details
- Sort by date, popularity, or relevance

### 2. Event Detail Page (`/event/[id]`)

**Purpose**: Display comprehensive event information with all related data.

**Design Elements**:

- Event header with name, date, and location
- Event description and details
- Speaker section with Bitcoiner profiles
- Schedule section with event sections
- Location information with maps integration
- Registration and website links
- Image gallery

**User Interactions**:

- Click on speaker names to view profiles
- Click on location for map view
- Click registration links
- Navigate through event sections

### 3. Calendar View (`/calendar`)

**Purpose**: Display events in calendar format for easy date-based navigation.

**Design Elements**:

- Monthly calendar grid
- Daily and monthly view toggles
- Event indicators on calendar dates
- Event details modal/popup
- Navigation between months
- Color coding for different event types

**User Interactions**:

- Click on dates to view events
- Navigate between months
- Switch between daily and monthly views
- Click on event indicators for details

## Data Structure

### Event Interface

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
	websites: Website[]
	price: number
	register?: Website
	createdAt: Date
	updatedAt: Date
}
```

### Event Section Interface

```typescript
interface EventSection {
	id: string
	sectionName: string
	startTime: Date
	endTime: Date
	spot: string
	description?: string
	bitcoiners: Bitcoiner[]
}
```

### Location Interface

```typescript
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
```

### Website Interface

```typescript
interface Website {
	id: string
	url: string
	type: 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'other'
	displayText?: string
}
```

## UI Components

### EventCard Component

**Purpose**: Reusable card component for displaying Event information in lists.

**Props**:

- `event: Event` - Event data to display
- `onClick?: () => void` - Click handler for navigation

**Design**:

- Card container with hover effects
- Event image or placeholder
- Event name and date
- Location information
- Speaker count and names
- Price information
- Clickable entire card area

### EventDetailPage Component

**Purpose**: Comprehensive event display with all related information.

**Props**:

- `eventId: string` - Event ID to display

**Design**:

- Hero section with event image and basic info
- Event details section
- Speaker grid with profiles
- Schedule timeline
- Location section with map
- Registration section

### CalendarPage Component

**Purpose**: Calendar view for event browsing.

**Props**:

- `events: Event[]` - Array of events to display

**Design**:

- Calendar grid layout
- Event indicators on dates
- Month navigation
- View toggle (daily/monthly)
- Event details modal

### EventFilters Component

**Purpose**: Filtering and search controls for event lists.

**Props**:

- `filters: EventFilters` - Current filter state
- `onFiltersChange: (filters: EventFilters) => void` - Filter change handler

**Design**:

- Search input field
- Date range picker
- Organizer dropdown
- Speaker dropdown
- Price range slider
- Clear filters button

## API Integration

### Data Fetching

- `useEvents()` - Fetch all events with filtering
- `useEvent(id)` - Fetch single event by ID
- `useUpcomingEvents()` - Fetch upcoming events
- `usePastEvents()` - Fetch past events

### API Endpoints

- `POST /api/event/list` - List events with filters
- `POST /api/event/get` - Get single event
- `POST /api/event/upcoming` - Get upcoming events
- `POST /api/event/past` - Get past events
- `POST /api/event/search` - Search events

## Validation Rules

### Frontend Validation

- Event name: Required, 2-200 characters
- Description: Required, 10-1000 characters
- Start date: Required, must be valid date
- End date: Optional, must be after start date
- Price: Non-negative number
- Images: Valid URL format

### Backend Validation

- Database constraints
- Business logic validation
- Date validation
- Price validation

## Error Handling

### User-Facing Errors

- Form validation errors with field-specific messages
- Network error handling with retry options
- Not found errors with navigation suggestions
- Date validation errors

### Error States

- Loading states during API calls
- Empty states for no events
- Error states with retry functionality

## Responsive Design

### Mobile (< 768px)

- Single column layout
- Stacked event cards
- Touch-friendly calendar
- Optimized event details

### Tablet (768px - 1024px)

- Two-column grid for events
- Side-by-side calendar and details
- Medium-sized buttons

### Desktop (> 1024px)

- Three-column grid for events
- Full calendar view
- Hover effects and interactions

## Accessibility

### ARIA Labels

- Form inputs properly labeled
- Calendar navigation controls
- Event card descriptions
- Modal dialog labels

### Keyboard Navigation

- Tab order through event cards
- Calendar navigation with arrow keys
- Enter key for event selection
- Escape key for modal dismissal

### Screen Reader Support

- Semantic HTML structure
- Alt text for event images
- Descriptive link text
- Calendar announcements

## Performance Considerations

### Loading States

- Skeleton loading for event cards
- Progressive loading for large lists
- Lazy loading for calendar events

### Caching

- Client-side caching of event data
- Calendar view caching
- Image lazy loading

### Image Optimization

- Next.js Image component
- Responsive image sizing
- WebP format support
- Lazy loading for gallery

## Calendar Features

### Monthly View

- Grid layout with dates
- Event indicators on dates
- Month navigation
- Today highlighting

### Daily View

- Timeline layout
- Event details for selected date
- Time-based sorting
- Speaker information

### Event Indicators

- Color coding by event type
- Dot indicators for multiple events
- Hover tooltips
- Click to view details

## Search and Filtering

### Search Functionality

- Full-text search across event fields
- Speaker name search
- Organizer name search
- Description content search

### Filter Options

- Date range filtering
- Organizer filtering
- Speaker filtering
- Price range filtering
- Location filtering

### Sort Options

- Date (ascending/descending)
- Name (A-Z, Z-A)
- Price (low to high, high to low)
- Popularity (event count)

## Location Integration

### Google Maps Integration

- Embedded maps for event locations
- Directions links
- Street view integration
- Location sharing

### Location Display

- Building name and address
- City and country
- Coordinates display
- Map link buttons

## Event Series Support

### Series Identification

- Event series name display
- Series grouping
- Recurring event indicators
- Series navigation

### Series Management

- Series creation
- Series editing
- Series deletion
- Series statistics

## Future Enhancements

### Planned Features

- Event creation and editing
- Speaker management
- Registration integration
- Event analytics
- Social sharing
- Event reminders
- Mobile app integration
- Offline support
