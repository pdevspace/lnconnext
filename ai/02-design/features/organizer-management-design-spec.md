# Organizer Management Design Specification

## Overview

The Organizer Management feature allows users to view, create, edit, and manage event organizer profiles. Each organizer can have multiple events and includes contact information and social media links.

## Feature Components

### 1. Organizer List Page (`/organizer`)

**Purpose**: Display all Organizers with filtering and search capabilities.

**Design Elements**:

- Header with "Organizers" title and "Add New Organizer" button
- Search bar with real-time filtering
- Filter options (Active/Inactive, Has Events)
- Grid layout of Organizer cards
- Loading and empty states

**User Interactions**:

- Search by name or bio content
- Filter by active status and event count
- Click on card to view details
- Click "Add New Organizer" to create new profile

### 2. Organizer Detail Page (`/organizer/[id]`)

**Purpose**: Display individual Organizer profile with full details and event history.

**Design Elements**:

- Fixed header with "Back to Organizers", "Edit", and "Delete" buttons
- Profile section with avatar, name, bio, and website
- Social media section with platform-specific icons
- Events section showing organizer's events
- Statistics section (total events, upcoming events, etc.)

**User Interactions**:

- Click "Back to Organizers" to return to list
- Click "Edit" to modify profile
- Click "Delete" with confirmation dialog
- Click social media links to open external profiles
- Click on events to view event details

### 3. Create Organizer Page (`/organizer/create`)

**Purpose**: Form for creating new Organizer profiles.

**Design Elements**:

- Form with name input field (required)
- Bio textarea (optional)
- Avatar URL input (optional)
- Website URL input (optional)
- Social media section with add/remove functionality
- Active status toggle
- Save and Cancel buttons

**User Interactions**:

- Enter organizer name (required)
- Add bio description
- Add avatar and website URLs
- Add multiple social media entries
- Toggle active status
- Save to create profile or cancel to return

### 4. Edit Organizer Page (`/organizer/edit/[id]`)

**Purpose**: Form for editing existing Organizer profiles.

**Design Elements**:

- Pre-populated form with existing data
- Same form structure as create page
- Update and Cancel buttons
- Loading states during save

**User Interactions**:

- Modify existing information
- Add or remove social media entries
- Update active status
- Save changes or cancel to return to detail page

## Data Structure

### Organizer Interface

```typescript
interface Organizer {
	id: string
	name: string
	bio?: string
	avatar?: string
	website?: string
	isActive: boolean
	socialMedia: SocialMedia[]
	events: Event[]
	createdAt: Date
	updatedAt: Date
}
```

### Organizer Stats Interface

```typescript
interface OrganizerStats {
	totalEvents: number
	upcomingEvents: number
	pastEvents: number
	totalSpeakers: number
	recentEvents: Event[]
}
```

### Form Data Interface

```typescript
interface OrganizerFormData {
	name: string
	bio?: string
	avatar?: string
	website?: string
	isActive: boolean
	socialMediaIds: string[]
}
```

## UI Components

### OrganizerCard Component

**Purpose**: Reusable card component for displaying Organizer information in lists.

**Props**:

- `organizer: Organizer` - Organizer data to display
- `onClick?: () => void` - Click handler for navigation

**Design**:

- Card container with hover effects
- Building icon (instead of avatar)
- Name and bio text
- Social media icons row
- Clickable entire card area
- No "View Profile" button (entire card is clickable)

### OrganizerForm Component

**Purpose**: Reusable form component for creating and editing Organizers.

**Props**:

- `initialData?: OrganizerFormData` - Initial form data for editing
- `onSubmit: (data: OrganizerFormData) => void` - Submit handler
- `onCancel: () => void` - Cancel handler
- `loading?: boolean` - Loading state

**Design**:

- Name input field with validation
- Bio textarea (optional)
- Avatar and website URL inputs
- Active status toggle
- Dynamic social media section
- Form validation and error display

### SocialMediaBox Component

**Purpose**: Display social media links with platform-specific styling.

**Props**:

- `socialMedia: SocialMedia[]` - Array of social media entries
- `ownerType: 'organizer'` - Owner type for styling

**Design**:

- Platform-specific icons and colors
- Hover effects for links
- Responsive grid layout
- External link indicators

## API Integration

### Data Fetching

- `useOrganizers()` - Fetch all Organizers with filtering
- `useOrganizer(id)` - Fetch single Organizer by ID
- `useOrganizerActions()` - CRUD operations

### API Endpoints

- `POST /api/organizer/list` - List Organizers with filters
- `POST /api/organizer/get` - Get single Organizer
- `POST /api/organizer/create` - Create new Organizer
- `POST /api/organizer/update` - Update existing Organizer
- `POST /api/organizer/delete` - Delete Organizer
- `POST /api/organizer/events` - Get organizer's events
- `POST /api/organizer/stats` - Get organizer statistics
- `POST /api/organizer/search` - Search organizers

## Validation Rules

### Frontend Validation

- Name: Required, 2-100 characters
- Bio: Optional, max 500 characters
- Website: Valid URL format (if provided)
- Avatar: Valid URL format (if provided)
- Social Media: Valid URLs and usernames

### Backend Validation

- Database constraints
- Business logic validation
- Duplicate prevention
- Referential integrity

## Error Handling

### User-Facing Errors

- Form validation errors with field-specific messages
- Network error handling with retry options
- Not found errors with navigation suggestions
- Delete confirmation dialogs

### Error States

- Loading states during API calls
- Empty states for no data
- Error states with retry functionality

## Responsive Design

### Mobile (< 768px)

- Single column layout
- Stacked form elements
- Touch-friendly buttons
- Optimized card layout

### Tablet (768px - 1024px)

- Two-column grid for cards
- Side-by-side form elements
- Medium-sized buttons

### Desktop (> 1024px)

- Three-column grid for cards
- Multi-column form layout
- Hover effects and interactions

## Accessibility

### ARIA Labels

- Form inputs properly labeled
- Button descriptions
- Card role definitions
- Status indicators

### Keyboard Navigation

- Tab order through form elements
- Enter key for form submission
- Escape key for cancel actions
- Arrow keys for navigation

### Screen Reader Support

- Semantic HTML structure
- Alt text for images
- Descriptive link text
- Status announcements

## Performance Considerations

### Loading States

- Skeleton loading for cards
- Progressive loading for large lists
- Optimistic updates for form submissions

### Caching

- Client-side caching of Organizer data
- Optimistic updates for better UX
- Background refetching for data freshness

### Image Optimization

- Lazy loading for avatars
- Responsive image sizing
- Fallback icons for missing avatars

## Business Logic

### Organizer Status

- Active organizers can create and manage events
- Inactive organizers are hidden from public views
- Status affects event visibility

### Event Relationships

- Organizers can have multiple events
- Events are linked to organizers
- Deleting organizer affects associated events

### Social Media Management

- Polymorphic relationship with SocialMedia entity
- Platform-specific validation
- URL format validation per platform

## Security Considerations

### Data Validation

- Input sanitization
- URL validation
- XSS prevention

### Access Control

- Currently public access
- Future: Role-based access control
- Admin-only delete operations

## Future Enhancements

### Planned Features

- Bulk operations for organizers
- Organizer analytics dashboard
- Event management integration
- Advanced search and filtering
- Organizer verification system
