# Design Specification

## Overview

This document provides a comprehensive design specification for the LNConnext platform. All pages follow a consistent design system with responsive layouts, proper navbar integration, and mobile-first design principles.

## Prerequisites

### Requirement Understanding
- **MANDATORY**: Before implementing any feature, ai must read and understand `ai/requirement-spec.md`
- All design decisions must trace back to the requirements specification
- Implementation should align with the functional and non-functional requirements
- Technical constraints and acceptance criteria must be considered

### UI/UX Design
- **Design System**: Consistent visual language across all pages
- **Color Palette**: 
  - Primary: Bitcoin orange (#F7931A) for accents and CTAs
  - Secondary: Dark backgrounds with light text for readability
  - Neutral: Grays for borders, dividers, and secondary text
- **Typography**: 
  - Headings: Bold, clear hierarchy (h1-h6)
  - Body text: Readable font sizes with proper line height
  - Code/Technical: Monospace font for technical content
- **Spacing**: Consistent padding and margins using Tailwind spacing scale
- **Visual Hierarchy**: Clear information architecture with proper contrast
- **Accessibility**: WCAG 2.1 AA compliance with proper color contrast ratios
- **Dark Mode Support**: 
  - CSS custom properties for theme switching
  - Dark/light mode toggle functionality
  - Consistent theming across all components
  - Automatic system preference detection

### Component Design
- **Atomic Design**: Components built using atomic design principles
- **Reusable Components**: 
  - Button variants (primary, secondary, outline, ghost)
  - Card components with consistent styling
  - Input fields with validation states
  - Badge components for status indicators
  - Modal and dialog components
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Custom Components**: 
  - EventCard: Standardized event display
  - SpeakerBox: Speaker information display
  - SocialMediaBox: Social media links
  - StatusBadge: Event status indicators
- **Responsive Components**: All components adapt to different screen sizes
- **Loading States**: Skeleton loaders and loading indicators
- **Error States**: Consistent error message display

### Public Components
- **Location**: `src/components/pages/public/`
- **Purpose**: Reusable components that can be used across multiple pages
- **Examples**: SocialMediaBox, SpeakerBox, and other shared UI components
- **Usage**: Import and use these components to maintain consistency across the application

### Data Flow & API Integration
- **Data Services**: Centralized data access through service layer
  - `EventService.ts`: Event data management
  - `OrganizerService.ts`: Organizer data management
  - `DataService.ts`: General data utilities
- **Type Safety**: Full TypeScript interfaces for all data structures
- **Static Data**: JSON-based data storage with type validation
- **Data Fetching**: Server-side rendering with Next.js App Router
- **Caching Strategy**: Static generation with ISR (Incremental Static Regeneration)
- **API Integration**: 
  - YouTube API for video metadata
  - Calendar integration (Google Calendar)
  - Social media link validation
- **Error Handling**: Graceful fallbacks for failed data requests
- **Loading States**: Proper loading indicators during data fetching

### UI Behavior & Interaction
- **Navigation**: 
  - Fixed navbar with smooth scrolling
  - Breadcrumb navigation for deep pages
  - Mobile-friendly hamburger menu
- **Interactions**:
  - Hover effects on interactive elements
  - Smooth transitions and animations
  - Touch-friendly mobile interactions
  - Keyboard navigation support
- **State Management**: 
  - React hooks for local state
  - URL state for filters and search
  - Persistent state for user preferences
- **Feedback Systems**:
  - Toast notifications for actions
  - Loading spinners for async operations
  - Success/error states for form submissions
- **Search & Filtering**:
  - Real-time search with debouncing
  - Filter persistence across page navigation
  - Clear filter options
- **Accessibility**:
  - ARIA labels and roles
  - Keyboard navigation
  - Screen reader support
  - Focus management

### Traceability
- **Requirement Mapping**: Each feature maps to specific requirements in `ai/requirement-spec.md`
- **Design Decisions**: Documented rationale for design choices
- **Component Documentation**: JSDoc comments for all components
- **Change Log**: Version control with meaningful commit messages
- **Testing Coverage**: Unit tests for critical components
- **Performance Metrics**: Core Web Vitals tracking
- **User Feedback**: Integration points for user feedback collection
- **Analytics**: Event tracking for user interactions
- **Error Monitoring**: Error boundary implementation with logging

## Global Design System

### Navbar Implementation
- **Component**: `src/components/Navbar.tsx`
- **Height**: Fixed 60px height with `z-50` positioning
- **Navigation Structure**:
  - **Logo**: "LNConnext" → `/` (Home)
  - **Event**: Users icon → `/event/` (Event List)
  - **Content**: Video icon → `/content/` (Content List) - **NEW**
  - **Organizer**: Building2 icon → `/organizer/` (Organizer List)
  - **Calendar**: Calendar icon → `/calendar/` (Calendar View)
  - **Info**: Info icon → `/info/` (Info Page)

### Layout Integration
- **Global Layout**: `src/app/layout.tsx` includes navbar globally
- **Top Spacing**: All pages use `mt-[130px]` or `pt-16` for navbar clearance
- **Scroll Control**: Custom scroll containers with `overflow: hidden` on body
- **Responsive Design**: Mobile-first approach with proper touch targets

## Page Design Specifications

### 1. Home Page (`/`)
- **Route**: `src/app/page.tsx`
- **Component**: `src/components/pages/home/HomePage.tsx`
- **Implementation**: Redirects to EventListPage
- **Status**: ✅ Implemented

### 2. Event List Page (`/event/`)
- **Route**: `src/app/event/page.tsx`
- **Component**: `src/components/pages/event/EventListPage.tsx`
- **Features**:
  - Fixed header with search and filter
  - Event cards with images, descriptions, and metadata
  - Auto-scroll to first upcoming event
  - Speaker badges and external links
  - Status badges (Upcoming/Past)
- **Status**: ✅ Implemented

### 3. Event Detail Page (`/event/[eventId]`)
- **Route**: `src/app/event/[eventId]/page.tsx`
- **Component**: `src/components/pages/event/EventPage.tsx`
- **Features**:
  - Hero section with event image
  - Event information and schedule
  - Speaker details with social media
  - Registration and external links
  - Interactive buttons (Save, Calendar, Website, Details)
- **Status**: ✅ Implemented

### 4. Calendar Page (`/calendar/`)
- **Route**: `src/app/calendar/page.tsx`
- **Component**: `src/components/pages/calendar/CalendarPage.tsx`
- **Features**:
  - Month and Daily view modes
  - Navigation controls (Previous, Today, Next)
  - Calendar grid with event indicators
  - Event details sidebar
  - Mobile-optimized bottom sheet
- **Status**: ✅ Implemented

### 5. Organizer List Page (`/organizer/`)
- **Route**: `src/app/organizer/page.tsx`
- **Component**: `src/components/pages/organizer/OrganizerListPage.tsx`
- **Features**:
  - Organizer cards with avatars
  - Event statistics and counts
  - Recent events preview
  - Hover effects and navigation
- **Status**: ✅ Implemented

### 6. Organizer Detail Page (`/organizer/[organizerId]`)
- **Route**: `src/app/organizer/[organizerId]/page.tsx`
- **Component**: `src/components/pages/organizer/OrganizerPage.tsx`
- **Features**:
  - Organizer information and statistics
  - Events list and speakers
  - Social media links
- **Status**: ✅ Implemented

### 7. Content Page (`/content/`) - **NEW**
- **Route**: `src/app/content/page.tsx`
- **Component**: `src/components/pages/content/ContentListPage.tsx`
- **Features**:
  - Content type tabs (All, Videos, Series, Courses, Guest)
  - Search and filter functionality
  - Content cards with thumbnails and metadata
  - YouTube integration ready
  - View counts and duration display
- **Status**: ✅ Implemented (Basic Structure)

### 8. Info Page (`/info/`)
- **Route**: `src/app/info/page.tsx`
- **Component**: `src/components/pages/info/InfoPage.tsx`
- **Features**:
  - Platform information
  - Features and contact details
- **Status**: ✅ Implemented

## Responsive Design Specifications

### Breakpoints
- **Mobile**: < 768px (Single column, full-width cards)
- **Tablet**: 768px - 1024px (2-3 column layouts)
- **Desktop**: > 1024px (3-7 column layouts)

### Mobile-First Features
- **Touch Targets**: Minimum 44px for all interactive elements
- **Typography**: Responsive font sizes using Tailwind classes
- **Navigation**: Touch-friendly button sizes and spacing
- **Cards**: Full-width on mobile, constrained on desktop
- **Images**: Responsive sizing with proper aspect ratios

### Layout Patterns
- **Fixed Headers**: All pages use fixed headers below navbar
- **Scroll Containers**: Custom scrollable areas with controlled behavior
- **Grid Systems**: Responsive grid layouts for different screen sizes
- **Spacing**: Consistent padding and margins using Tailwind classes

## Data Integration

### Event Data Structure
```typescript
interface Event {
  id: string;
  name: string;
  description: string;
  organizer: Organizer;
  eventSeriesName?: string;
  location?: Location;
  sections: EventSection[];
  startDate: Date;
  endDate?: Date;
  speakers: Speaker[];
  images: string[];
  website: Website[];
  price: number;
  register?: Website;
}
```

### Content Data Structure (Future)
```typescript
interface Content {
  id: string;
  name: string;
  description: string;
  type: 'offline' | 'online';
  category: 'meetup' | 'conference' | 'course' | 'video' | 'series' | 'guest';
  creator: Creator;
  youtubeUrl?: string;
  videoId?: string;
  duration?: number;
  viewCount?: number;
  // ... additional fields
}
```

## Implementation Guidelines

### CSS Classes and Styling
- **Spacing**: Use Tailwind spacing classes (`p-4`, `m-6`, `gap-4`)
- **Colors**: Use CSS custom properties for consistent theming
- **Typography**: Semantic font size classes (`text-sm`, `text-lg`, `text-xl`)
- **Layout**: Flexbox and Grid classes for responsive layouts

### Component Structure
- **Page Components**: Main page layout and structure
- **Feature Components**: Specific functionality components
- **Data Components**: Components that handle data display

### Performance Considerations
- **Image Optimization**: Next.js Image component with proper sizing
- **Lazy Loading**: Implement for large lists and images
- **Code Splitting**: Use dynamic imports for large components
- **Caching**: Implement proper caching strategies

### Accessibility Features
- **Semantic HTML**: Proper HTML elements and structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: All interactive elements accessible
- **Color Contrast**: Proper contrast ratios maintained
- **Focus Management**: Clear focus indicators and logical tab order

## Testing and Quality Assurance

### Component Testing
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Visual Tests**: Responsive layout testing
- **Accessibility Tests**: Screen reader and keyboard navigation testing

### Performance Testing
- **Load Testing**: Large dataset handling
- **Mobile Testing**: Various mobile device testing
- **Browser Testing**: Cross-browser compatibility
- **Performance Monitoring**: Core Web Vitals tracking

## Future Enhancements

### Content Page Enhancements
- **YouTube Integration**: Full YouTube API integration
- **Video Thumbnails**: Actual video thumbnails and metadata
- **Series Support**: Multi-episode series display
- **Creator Profiles**: Detailed creator information

### PWA Features
- **Web App Manifest**: Installation support
- **Service Worker**: Offline functionality
- **Push Notifications**: Event and content notifications
- **App Shell**: Native app-like experience

### Advanced Features
- **Search Enhancement**: Advanced filtering and sorting
- **User Accounts**: Personalization and saved content
- **Social Features**: Sharing and community features
- **Analytics**: Usage tracking and insights

## Dark Mode Implementation

### Theme System
- **CSS Custom Properties**: Theme variables for consistent color management
- **Theme Provider**: React context for theme state management
- **System Preference**: Automatic detection of user's system theme preference
- **Manual Toggle**: User-controlled theme switching with persistence
- **Theme Persistence**: Local storage to remember user's theme choice

### Dark Mode Components
- **Theme Toggle**: Toggle button in navbar for switching themes
- **Theme Context**: React context provider for theme state
- **CSS Variables**: Dynamic color variables that change based on theme
- **Component Adaptation**: All components support both light and dark themes
- **Image Handling**: Proper image contrast in both themes

### Implementation Details
```typescript
// Theme context structure
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

// CSS custom properties for theming
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 98%;
  // ... additional theme variables
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
  // ... dark theme variables
}
```

### Theme Integration
- **Tailwind CSS**: Dark mode classes with `dark:` prefix
- **Component Library**: shadcn/ui components with built-in dark mode support
- **Custom Components**: All custom components implement theme-aware styling
- **Icons**: Icon colors adapt to theme
- **Images**: Proper contrast and visibility in both themes

## Development Guidelines

### Before Implementation
1. **Read Requirements**: Always read `ai/requirement-spec.md` before starting
2. **Understand Context**: Review existing components and patterns
3. **Check Public Components**: Look for reusable components in `src/components/pages/public/`
4. **Plan Dark Mode**: Ensure all new components support dark mode
5. **Follow Design System**: Use established patterns and components

### Component Development
1. **Use Public Components**: Import and use existing public components
2. **Implement Dark Mode**: Add dark mode support to all new components
3. **Follow TypeScript**: Use proper TypeScript interfaces
4. **Add Documentation**: Include JSDoc comments for new components
5. **Test Responsiveness**: Ensure components work on all screen sizes

### Quality Assurance
1. **Accessibility**: Test with screen readers and keyboard navigation
2. **Performance**: Optimize images and loading states
3. **Cross-browser**: Test on different browsers and devices
4. **Theme Testing**: Verify both light and dark modes work correctly
5. **Mobile Testing**: Ensure mobile-first design principles are followed

## Conclusion

The LNConnext platform now has a comprehensive design specification with:

- ✅ **Complete Navigation**: All routes implemented with proper navbar integration
- ✅ **Responsive Design**: Mobile-first approach with proper breakpoints
- ✅ **Consistent Layout**: Unified design system across all pages
- ✅ **Performance Optimized**: Proper image handling and scroll control
- ✅ **Accessibility Ready**: Semantic HTML and keyboard navigation
- ✅ **Dark Mode Support**: Complete theme system with light/dark modes
- ✅ **Public Components**: Reusable components for consistency
- ✅ **Requirement Traceability**: Clear mapping to requirements specification
- ✅ **Future Ready**: Structure in place for content and PWA features

All pages follow the established design patterns and are ready for production use. The design specification ensures consistency, maintainability, and user experience across the entire platform.
