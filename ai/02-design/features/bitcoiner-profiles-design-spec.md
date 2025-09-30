# Bitcoiner Profiles Design Specification

## Overview
The Bitcoiner Profiles feature allows users to view, create, edit, and manage Bitcoin community member profiles. Each profile includes personal information, expertise areas, and social media links.

## Feature Components

### 1. Bitcoiner List Page (`/bitcoiner`)
**Purpose**: Display all Bitcoiners with filtering and search capabilities.

**Design Elements**:
- Header with "Bitcoiners" title and "Add New Bitcoiner" button
- Search bar with real-time filtering
- Platform filter dropdown (Facebook, YouTube, Twitter, LinkedIn, Instagram)
- Grid layout of Bitcoiner cards
- Loading and empty states

**User Interactions**:
- Search by name or social media username
- Filter by social media platform
- Click on card to view details
- Click "Add New Bitcoiner" to create new profile

### 2. Bitcoiner Detail Page (`/bitcoiner/[bitcoinerId]`)
**Purpose**: Display individual Bitcoiner profile with full details.

**Design Elements**:
- Fixed header with "Back to Bitcoiners", "Edit", and "Delete" buttons
- Profile section with avatar, name, bio, and expertise
- Social media section with platform-specific icons and links
- Responsive layout with proper spacing

**User Interactions**:
- Click "Back to Bitcoiners" to return to list
- Click "Edit" to modify profile
- Click "Delete" with confirmation dialog
- Click social media links to open external profiles

### 3. Create Bitcoiner Page (`/bitcoiner/create`)
**Purpose**: Form for creating new Bitcoiner profiles.

**Design Elements**:
- Form with name input field
- Dynamic social media section with add/remove functionality
- Platform selection dropdown
- Username and URL input fields
- Save and Cancel buttons

**User Interactions**:
- Enter bitcoiner name (required)
- Add multiple social media entries
- Select platform for each social media entry
- Enter username and URL for each platform
- Save to create profile or cancel to return

### 4. Edit Bitcoiner Page (`/bitcoiner/edit/[id]`)
**Purpose**: Form for editing existing Bitcoiner profiles.

**Design Elements**:
- Pre-populated form with existing data
- Same form structure as create page
- Update and Cancel buttons
- Loading states during save

**User Interactions**:
- Modify existing information
- Add or remove social media entries
- Save changes or cancel to return to detail page

## Data Structure

### Bitcoiner Interface
```typescript
interface Bitcoiner {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  isActive: boolean;
  socialMedia: SocialMedia[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Social Media Interface
```typescript
interface SocialMedia {
  id: string;
  displayText: string;
  username: string;
  platform: string;
  urlLink: string;
  ownerId: string;
  ownerType: 'bitcoiner' | 'organizer';
}
```

### Form Data Interface
```typescript
interface BitcoinerFormData {
  name: string;
  socialMedia: SocialMediaData[];
}

interface SocialMediaData {
  id?: string;
  displayText: string;
  username: string;
  platform: string;
  urlLink: string;
}
```

## UI Components

### BitcoinerCard Component
**Purpose**: Reusable card component for displaying Bitcoiner information in lists.

**Props**:
- `bitcoiner: Bitcoiner` - Bitcoiner data to display
- `onClick?: () => void` - Click handler for navigation

**Design**:
- Card container with hover effects
- Avatar display (with fallback icon)
- Name and bio text
- Social media icons row
- Clickable entire card area

### BitcoinerForm Component
**Purpose**: Reusable form component for creating and editing Bitcoiners.

**Props**:
- `initialData?: BitcoinerFormData` - Initial form data for editing
- `onSubmit: (data: BitcoinerFormData) => void` - Submit handler
- `onCancel: () => void` - Cancel handler
- `loading?: boolean` - Loading state

**Design**:
- Name input field with validation
- Dynamic social media section
- Add/Remove social media buttons
- Platform selection dropdown
- Username and URL input fields
- Form validation and error display

### SocialMediaCard Component
**Purpose**: Display social media links with platform-specific styling.

**Props**:
- `socialMedia: SocialMedia[]` - Array of social media entries
- `ownerType: 'bitcoiner' | 'organizer'` - Owner type for styling

**Design**:
- Platform-specific icons and colors
- Hover effects for links
- Responsive grid layout
- External link indicators

## API Integration

### Data Fetching
- `useBitcoiners()` - Fetch all Bitcoiners with filtering
- `useBitcoiner(id)` - Fetch single Bitcoiner by ID
- `useBitcoinerActions()` - CRUD operations

### API Endpoints
- `POST /api/bitcoiner/list` - List Bitcoiners with filters
- `POST /api/bitcoiner/get` - Get single Bitcoiner
- `POST /api/bitcoiner/create` - Create new Bitcoiner
- `POST /api/bitcoiner/update` - Update existing Bitcoiner
- `POST /api/bitcoiner/delete` - Delete Bitcoiner

## Validation Rules

### Frontend Validation
- Name: Required, 2-100 characters
- Social Media Username: Required for each entry
- Social Media URL: Valid URL format
- Platform: Must be selected from predefined options

### Backend Validation
- Database constraints
- Business logic validation
- Duplicate prevention

## Error Handling

### User-Facing Errors
- Form validation errors with field-specific messages
- Network error handling with retry options
- Not found errors with navigation suggestions

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

### Keyboard Navigation
- Tab order through form elements
- Enter key for form submission
- Escape key for cancel actions

### Screen Reader Support
- Semantic HTML structure
- Alt text for images
- Descriptive link text

## Performance Considerations

### Loading States
- Skeleton loading for cards
- Progressive loading for large lists
- Optimistic updates for form submissions

### Caching
- Client-side caching of Bitcoiner data
- Optimistic updates for better UX
- Background refetching for data freshness

### Image Optimization
- Lazy loading for avatars
- Responsive image sizing
- Fallback icons for missing avatars