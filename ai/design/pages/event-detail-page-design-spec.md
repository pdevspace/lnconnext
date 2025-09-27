# Event Detail Page Design Specification

## Overview

The Event Detail Page provides comprehensive information about individual Bitcoin offline events (meetups, conferences, courses), including detailed descriptions, speaker information, schedules, and interactive features for user engagement. This page is specifically for offline events only - online content will have separate content pages and content detail pages in the future.

## Prerequisites

### Requirement Understanding
- **MANDATORY**: Before implementing any feature, ai must read and understand `ai/design/design-spec.md`
- The design-spec.md provides comprehensive design specifications including: UI/UX Design (color palette, typography, spacing, dark mode), Component Design (reusable components, atomic design principles), Data Flow & API Integration (service layer, type safety, caching), UI Behavior & Interaction (navigation, state management, accessibility), and Traceability (requirement mapping, testing coverage). It also includes development guidelines, public component locations (`src/components/pages/public/`), and mandatory requirement understanding from `ai/requirement-spec.md`.

## Section Description

### 1. ✅ **Event Image**
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventImage`
- **Functionality**: Display primary event visual
- **Implementation**: Next.js Image component with optimization
- **Styling**: 
  - Aspect ratio: Square (aspect-square)
  - Rounded corners with overflow hidden
  - Responsive sizing with priority loading
- **Accessibility**: Alt text with event name
- **Data Used**: `event.images[0]` (string)

### 2. ✅ **Event Add to Calendar**
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventAddToCalendarButton`
- **Functionality**: Generate Google Calendar link for event
- **Implementation**: External link with event details
- **Styling**: Calendar icon button
- **Interaction**: 
  - Hover: Show popup text "Add to Calendar"
  - Click: Opens Google Calendar in new tab
- **Data Used**: `event.name` (string), `event.description` (string), `event.startDate` (Date), `event.endDate` (Date), `event.location.googleMapsUrl` (string)

### 3. ✅ **Event Register** (nullable - hide when event.register is null)
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventRegisterButton`
- **Functionality**: Register for event or buy tickets
- **Implementation**: External link with event details
- **Styling**: Register icon button
- **Interaction**: Click opens register or buy ticket link in new tab
- **Data Used**: `event.price` (number), `event.register` (Website)

### 4. ✅ **Event Go to Original Link** (nullable or 1 or many - hide when null)
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventOriginalLinkButton`
- **Functionality**: Multiple icon buttons for different link types
- **Implementation**: Icon buttons with hover popup text (flex row layout)
- **Styling**: Icon buttons with external link icons
- **Button Types**: Facebook Post, Other
- **Interaction**: Click opens original link in new tab
- **Data Used**: `event.website` (Website[])

### 5. ✅ **Event Name**
- **PATH**: no component
- **Functionality**: Display event title
- **Implementation**: Large typography component
- **Styling**: 4xl font size, bold weight
- **Data Used**: `event.name` (string)

### 6. ✅ **Event Organizer Box**
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventOrganizerBox`
- **Functionality**: Display organizer information and social media
- **Implementation**: Card component with organizer details
- **Styling**: 
  - Card component with border radius and padding
  - Clickable entire box except social media section
  - 2-line layout: Organizer Name (line 1), social media icons (line 2)
- **Interaction**: 
  - Click organizer box (excluding social media): Go to organizer page
  - Click social media icon: Go to social media link in new tab
- **Components Used**: Social Media List (Public Component)
- **Data Used**: `event.organizer.name` (string), `event.organizer.socialMedia` (SocialMedia[])

### 7. ✅ **Event Speaker List**
- **PATH**: `src/components/pages/public/SpeakerBox`
- **Functionality**: Display list of event speakers
- **Implementation**: Speaker names in flex column layout
- **Styling**: 
  - Card component with border radius and padding (similar to Organizer component)
  - Each speaker in a clickable small box (not clickable text)
  - Border radius for individual speaker boxes
- **Interaction**: Click speaker box to go to speaker page
- **Data Used**: `event.speakers` (Speaker[])

### 8. ✅ **Event Date Period** (end dates nullable)
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventDatePeriodBox`
- **Functionality**: Show event timing in GMT+7
- **Implementation**: Start and end dates display
- **Styling**: 
  - Border with rounded corners and padding
  - Single line display only
- **Logic**: 
  - Show only start date when end date is null
  - If same date: display "Aug 10, 2025 at 09:00 to 16:00" format
  - If different dates: display full date range
- **Data Used**: `event.startDate` (Date), `event.endDate` (Date)

### 9. ✅ **Event Location**
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventLoctionBox`
- **Functionality**: Display venue information with Google Maps link
- **Implementation**: Location name with Google Maps integration
- **Styling**: 
  - Border with rounded corners and padding
  - Clickable entire box
  - No "View on Google Maps" text displayed
- **Interaction**: Click entire box opens Google Maps in new tab
- **Data Used**: `event.location.buildingName` (string), `event.location.googleMapsUrl` (string)

### 10. ✅ **Event Description**
- **PATH**: no component
- **Functionality**: Show detailed event description
- **Implementation**: Text content component
- **Styling**: Proper typography with muted foreground color
- **Data Used**: `event.description` (string)

### 11. ✅ **Event Schedule**
- **PATH**: `src/components/pages/event/EventComponent.tsx/EventScheduleBox`
- **Functionality**: Display event sections with details
- **Implementation**: Multiple event sections, each showing section details
- **Styling**: Card component with schedule information
- **Section Details**: sectionName, startTime, endTime, spot (room/stage), speakers
- **Data Used**: `event.sections` (EventSection[])
  - Each section uses: `section.sectionName` (string), `section.startTime` (Date), `section.endTime` (Date), `section.spot` (room/stage name), `section.speakers` (Speaker[])

## Layout Description

### ✅ Desktop View (Web View)
- **Layout**: Two-column layout with left (30%) and right (70%) columns
- **Scrolling**: Left and right columns scroll together (synchronized scrolling)

#### Left Column (30%)
- **Content Stack**:
  1. **Event Image**
  2. **Action Row**
   -  **Event Register**
   -  **Event Add to Calendar**
  3. **Event Go to Original Link**
  4. **Event Speaker List**

#### Right Column (70%)
- **Content Stack**:
  1. **Event Name**
  2. **Event Organizer Box**
  3. **Event Speaker List**
  4. **Event Date Period**
  5. **Event Location**
  6. **Event Description**
  7. **Event Schedule**

### ✅ Mobile View
- **Layout**: Single column layout (top to bottom)
- **Sticky Elements**: Event name and action buttons never hide when scrolling

#### Content Stack (Top to Bottom)
1. **Event Image**
2. **Event Name**
3. **Event Organizer Box**
4. **Action Row**
   - **Event Date Period (Left)**
   - **Event Register (Middle Left)** 
   - **Event Add to Calendar (Middle Right)**
   - **Event Go to Original Link (Right)**
5. **Event Location**
6. **Event Description**
7. **Event Schedule**
8. **Event Speaker List**

## Components

### ✅ App Router
- **Path**: `src/app/event/[eventId]/page.tsx`

### ✅ Page Component
- **Path**: `src/components/pages/event/EventPage.tsx`
- **Props**: `eventId` type: string
- **State Management**:
  - `event` state from EventService
  - `savedEvent` boolean for bookmark status
- **Data Fetching**: Uses `getEventById()` from EventService

### ✅ Public Component (use in this page)
- **Social Media List**:
   - **Path**: `src/components/pages/public/SocialMediaBox.tsx`
   - **Props**: event.socialMedia type: SocialMedia[]
   - social media icon in flex-row
   - hover show display text
   - click redirect to urlLink
- **Speaker List**:
   - **Path**: `src/components/pages/public/SpeakerBox.tsx`
   - **Props**: event.speakers type: Speaker[]
   - speaker name in flex column
   - click redirect to speaker page

### ✅ Icon Buttons
- calendar icon for add to calendar Section
- icon for Register Section type "Register"
- icon for original link Section type "Facebook Post"
- icon for original link Section type "Other"
- time icon for Event Date Period Section
- location icon for Event Location Section


## Service Architecture

### ✅ Core Event Service
- **PATH**: `src/data/EventService.ts`
- **Service Name**: `EventService.getEventById()`
- **Parameters**: `{ eventId: string }`
## Data Flow

### ✅ Initial Page Load
1. **Route Parameter**: Extract `eventId` from URL
2. **Primary Data**: Call `EventService.getEventById(eventId)`
 - set state **Event Data**: `Event event = getEventById(eventId);`

## Performance Considerations

### ✅ Image Optimization
- **Next.js Image**: Automatic optimization and lazy loading
- **Priority Loading**: Event image loads with priority
- **Responsive Sizing**: Appropriate sizes for different viewports
- **Fallback Images**: Graceful handling of missing images

### ✅ State Management
- **Local State**: Minimal state for UI interactions
- **Data Caching**: Event data cached in component state
- **Efficient Re-renders**: Optimized state updates

### ✅ Loading Performance
- **Static Generation**: Pre-generated pages for all events
- **Fast Navigation**: Instant page loads from static files
- **Optimized Assets**: Compressed images and optimized code

## Accessibility Features

### ✅ ARIA Labels
- **Action Buttons**: Proper labeling for screen readers
- **Status Badges**: Clear status communication
- **Navigation Links**: Descriptive link text

### ✅ Keyboard Navigation
- **Tab Order**: Logical tab sequence through interface
- **Button Focus**: Visible focus states for all interactive elements
- **Keyboard Shortcuts**: Standard keyboard navigation support

### ✅ Visual Accessibility
- **Color Contrast**: Sufficient contrast for all text and backgrounds
- **Status Indicators**: Color and text for status communication
- **Icon Usage**: Icons paired with text labels where appropriate
