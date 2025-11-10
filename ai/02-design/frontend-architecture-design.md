# Frontend Architecture Design

## Overview

The frontend is built with Next.js 14, React 18, TypeScript, and Tailwind CSS. It follows a component-based architecture with custom hooks for data management and a consistent design system.

## Architecture Layers

### 1. Type System (`src/types/`)

TypeScript interfaces defining data contracts between frontend and backend.

#### Core Types

```typescript
// Event Types
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

// Bitcoiner Types
export interface Bitcoiner {
	id: string
	name: string
	bio?: string
	avatar?: string
	expertise: string[]
	isActive: boolean
	socialMedia: SocialMedia[]
}

// Organizer Types
export interface Organizer {
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

#### Form Data Types

```typescript
// Bitcoiner Form
export interface BitcoinerFormData {
	name: string
	socialMedia: SocialMediaData[]
}

// Organizer Form
export interface OrganizerFormData {
	name: string
	bio?: string
	avatar?: string
	website?: string
	isActive: boolean
	socialMediaIds: string[]
}
```

#### Filter Types

```typescript
// Bitcoiner Filters
export interface BitcoinerFilters {
	searchTerm: string
	selectedPlatform: string
}

// Event Filters
export interface EventFilters {
	search?: string
	organizerId?: string
	speakerId?: string
	dateFrom?: Date
	dateTo?: Date
	limit?: number
	offset?: number
}

// Organizer Filters
export interface OrganizerFilters {
	search?: string
	isActive?: boolean
	hasEvents?: boolean
	limit?: number
	offset?: number
}
```

### 2. Custom Hooks (`src/hooks/`)

React hooks for data fetching, state management, and business logic.

#### Data Fetching Hooks

```typescript
// Event Hooks
export function useEvents(filters?: EventFilters): {
	events: Event[]
	loading: boolean
	error: string | null
	refetch: () => void
}

export function useEvent(eventId: string): {
	event: Event | null
	loading: boolean
	error: string | null
	refetch: () => void
}

export function useUpcomingEvents(limit?: number): {
	events: Event[]
	loading: boolean
	error: string | null
}

export function usePastEvents(limit?: number): {
	events: Event[]
	loading: boolean
	error: string | null
}

// Bitcoiner Hooks
export function useBitcoiners(filters?: BitcoinerFilters): {
	bitcoiners: Bitcoiner[]
	loading: boolean
	error: string | null
	refetch: () => void
}

export function useBitcoiner(bitcoinerId: string): {
	bitcoiner: Bitcoiner | null
	loading: boolean
	error: string | null
	refetch: () => void
}

// Organizer Hooks
export function useOrganizers(filters?: OrganizerFilters): {
	organizers: Organizer[]
	loading: boolean
	error: string | null
	refetch: () => void
}

export function useOrganizer(organizerId: string): {
	organizer: Organizer | null
	loading: boolean
	error: string | null
	refetch: () => void
}
```

#### CRUD Operation Hooks

```typescript
// Bitcoiner CRUD
export function useBitcoinerActions() {
  const createBitcoiner = async (data: BitcoinerFormData): Promise<boolean>
  const updateBitcoiner = async (id: string, data: BitcoinerFormData): Promise<boolean>
  const deleteBitcoiner = async (id: string): Promise<boolean>
  return { createBitcoiner, updateBitcoiner, deleteBitcoiner }
}

// Organizer CRUD
export function useOrganizerActions() {
  const createOrganizer = async (data: OrganizerFormData): Promise<boolean>
  const updateOrganizer = async (id: string, data: OrganizerFormData): Promise<boolean>
  const deleteOrganizer = async (id: string): Promise<boolean>
  return { createOrganizer, updateOrganizer, deleteOrganizer }
}
```

### 3. Page Components (`src/components/pages/`)

Main page-level components organized by feature.

#### Bitcoiner Pages

```
bitcoiner/
├── BitcoinerCard.tsx           # Card component for bitcoiner display
├── BitcoinerDetailPage.tsx     # Individual bitcoiner detail page
├── BitcoinerFilters.tsx        # Filter component for bitcoiner list
├── BitcoinerForm.tsx           # Form for creating/editing bitcoiners
├── BitcoinerListPage.tsx       # Main bitcoiner listing page
├── CreateBitcoinerPage.tsx     # Create bitcoiner page
├── EditBitcoinerPage.tsx       # Edit bitcoiner page
└── SocialMediaCard.tsx         # Social media display component
```

#### Event Pages

```
event/
├── EventComponent.tsx          # Reusable event display component
├── EventDetailPage.tsx         # Individual event detail page
└── EventListPage.tsx           # Event listing page
```

#### Organizer Pages

```
organizer/
├── CreateOrganizerPage.tsx     # Create organizer page
├── EditOrganizerPage.tsx       # Edit organizer page
├── OrganizerCard.tsx           # Card component for organizer display
├── OrganizerDetailPage.tsx     # Individual organizer detail page
├── OrganizerForm.tsx           # Form for creating/editing organizers
└── OrganizerListPage.tsx       # Main organizer listing page
```

#### Calendar Pages

```
calendar/
├── CalendarPage.tsx            # Main calendar view
├── DailyCalendarView.tsx       # Daily calendar component
├── DateCell.tsx                # Individual date cell
├── EventCard.tsx               # Event card for calendar
├── EventDetails.tsx            # Event details modal
└── MonthlyCalendarView.tsx     # Monthly calendar component
```

### 4. UI Components (`src/components/ui/`)

Reusable UI components following a design system.

#### Core UI Components

```typescript
// Button Component
export function Button({ variant, size, children, ...props }: ButtonProps)

// Card Component
export function Card({ children, className, ...props }: CardProps)

// Input Component
export function Input({
	type,
	placeholder,
	value,
	onChange,
	...props
}: InputProps)

// Select Component
export function Select({
	options,
	value,
	onChange,
	placeholder,
	...props
}: SelectProps)

// Badge Component
export function Badge({ variant, children, ...props }: BadgeProps)

// Tabs Component
export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps)
```

#### Specialized Components

```typescript
// Social Icon Component
export function SocialIcon({
	platform,
	url,
	username,
	displayText,
}: SocialIconProps)

// Social Media Box
export function SocialMediaBox({ socialMedia, ownerType }: SocialMediaBoxProps)

// Speaker Box
export function SpeakerBox({ bitcoiners, title }: SpeakerBoxProps)
```

## Design System

### Color Palette

```css
/* Primary Colors */
--primary: #f7931a; /* Bitcoin Orange */
--primary-dark: #e6850e; /* Darker Orange */
--primary-light: #ffa726; /* Lighter Orange */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Families */
font-family:
	'Inter',
	-apple-system,
	BlinkMacSystemFont,
	'Segoe UI',
	sans-serif;

/* Font Sizes */
text-xs: 0.75rem; /* 12px */
text-sm: 0.875rem; /* 14px */
text-base: 1rem; /* 16px */
text-lg: 1.125rem; /* 18px */
text-xl: 1.25rem; /* 20px */
text-2xl: 1.5rem; /* 24px */
text-3xl: 1.875rem; /* 30px */
text-4xl: 2.25rem; /* 36px */
```

### Spacing System

```css
/* Spacing Scale */
space-1: 0.25rem; /* 4px */
space-2: 0.5rem; /* 8px */
space-3: 0.75rem; /* 12px */
space-4: 1rem; /* 16px */
space-6: 1.5rem; /* 24px */
space-8: 2rem; /* 32px */
space-12: 3rem; /* 48px */
space-16: 4rem; /* 64px */
space-24: 6rem; /* 96px */
```

## Component Patterns

### 1. Card Pattern

Consistent card-based layout for displaying entities.

```typescript
// Bitcoiner Card
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <div className="flex items-center space-x-4">
    <Avatar src={bitcoiner.avatar} />
    <div className="flex-1">
      <h3 className="font-semibold">{bitcoiner.name}</h3>
      <p className="text-gray-600">{bitcoiner.bio}</p>
      <SocialMediaBox socialMedia={bitcoiner.socialMedia} />
    </div>
  </div>
</Card>
```

### 2. List Pattern

Consistent list layouts with filtering and pagination.

```typescript
// Bitcoiner List Page
<div className="space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold">Bitcoiners</h1>
    <Button onClick={handleCreate}>Add New Bitcoiner</Button>
  </div>

  <BitcoinerFilters
    filters={filters}
    onFiltersChange={setFilters}
  />

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {bitcoiners.map(bitcoiner => (
      <BitcoinerCard key={bitcoiner.id} bitcoiner={bitcoiner} />
    ))}
  </div>
</div>
```

### 3. Detail Pattern

Consistent detail page layouts with actions.

```typescript
// Bitcoiner Detail Page
<div className="max-w-4xl mx-auto">
  <div className="bg-white rounded-lg shadow-lg p-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Avatar src={bitcoiner.avatar} size="lg" />
        <div>
          <h1 className="text-3xl font-bold">{bitcoiner.name}</h1>
          <p className="text-gray-600">{bitcoiner.bio}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handleEdit}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </div>
    </div>

    <SocialMediaBox socialMedia={bitcoiner.socialMedia} />
  </div>
</div>
```

### 4. Form Pattern

Consistent form layouts with validation.

```typescript
// Bitcoiner Form
<form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      value={formData.name}
      onChange={(e) => handleInputChange('name', e.target.value)}
      placeholder="Enter bitcoiner name"
    />
    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
  </div>

  <div>
    <Label>Social Media</Label>
    <SocialMediaForm
      socialMedia={formData.socialMedia}
      onChange={(socialMedia) => handleInputChange('socialMedia', socialMedia)}
    />
  </div>

  <div className="flex justify-end space-x-2">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? 'Saving...' : 'Save'}
    </Button>
  </div>
</form>
```

## State Management

### Local State

- React `useState` for component-level state
- Form state management with controlled components
- Loading and error states for async operations

### Global State

- Custom hooks for data fetching and caching
- Context API for theme and user preferences
- URL state for filters and pagination

### Data Flow

```
API Request → Custom Hook → Component State → UI Update
     ↓
Error Handling → Error State → Error UI
     ↓
Loading State → Loading UI
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px; /* Small devices */
md: 768px; /* Medium devices */
lg: 1024px; /* Large devices */
xl: 1280px; /* Extra large devices */
2xl: 1536px; /* 2X large devices */
```

### Grid System

```typescript
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// Responsive Layout
<div className="flex flex-col lg:flex-row gap-6">
  <div className="lg:w-1/3">
    <Sidebar />
  </div>
  <div className="lg:w-2/3">
    <MainContent />
  </div>
</div>
```

## Performance Optimizations

### Code Splitting

- Dynamic imports for route-based code splitting
- Lazy loading for heavy components
- Bundle optimization with Next.js

### Image Optimization

- Next.js Image component for automatic optimization
- Lazy loading for images
- Responsive image sizing

### Caching

- Static generation for public pages
- ISR for dynamic content
- Client-side caching with custom hooks

## Accessibility

### ARIA Labels

- Proper labeling for form inputs
- Screen reader support for interactive elements
- Keyboard navigation support

### Color Contrast

- WCAG AA compliant color combinations
- High contrast mode support
- Color-blind friendly palette

### Focus Management

- Visible focus indicators
- Logical tab order
- Skip links for navigation

## Testing Strategy

### Unit Testing

- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing

### Integration Testing

- API integration testing
- User flow testing
- Cross-browser compatibility

### E2E Testing

- Critical user journey testing
- Performance testing
- Accessibility testing
