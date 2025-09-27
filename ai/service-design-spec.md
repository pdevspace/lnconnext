# Service Design Specification

## Overview

This document defines the service architecture for LNConnext, focusing on optimized data fetching and efficient frontend integration. The design moves away from fetching everything and selecting what to display, instead implementing targeted services that return only essential data for each UI section.

## Service Architecture Principles

### 1. **Targeted Data Fetching**
- Each service returns only the data needed for specific UI sections
- No unnecessary nested objects or redundant data
- Optimized response payloads for faster loading

### 2. **Lazy Loading Strategy**
- Primary content loads immediately
- Secondary content loads as needed
- Background loading for non-critical data

### 3. **Caching Strategy**
- Service-level caching for frequently accessed data
- Client-side caching for user interactions
- Cache invalidation for real-time updates

## Service Specifications

### Core Activity Service

#### `ActivityService.getActivityById()`
- **Purpose**: Get essential activity information for detail page
- **Parameters**: `{ activityId: string }`
- **Response Interface**:
  ```typescript
  interface ActivityDetailResponse {
    id: string;
    name: string;
    description: string;
    type: 'offline' | 'online';
    category: 'meetup' | 'conference' | 'course' | 'video' | 'series' | 'guest';
    status: 'live' | 'upcoming' | 'past' | 'available';
    startDate: Date;
    endDate?: Date;
    price: number;
    images: string[];
    creatorId: string;
    locationId?: string;
  }
  ```
- **Usage**: Header section, image section, time/date section, description section
- **Caching**: 5 minutes for live events, 1 hour for others

#### `ActivityService.getRelatedActivities()`
- **Purpose**: Get related activities for recommendation section
- **Parameters**: `{ activityId: string, limit: number }`
- **Response Interface**:
  ```typescript
  interface RelatedActivitiesResponse {
    activities: {
      id: string;
      name: string;
      type: 'offline' | 'online';
      category: string;
      startDate: Date;
      images: string[];
    }[];
  }
  ```
- **Usage**: Related activities section
- **Caching**: 30 minutes

### Creator Service

#### `CreatorService.getCreatorBasicInfo()`
- **Purpose**: Get essential creator information
- **Parameters**: `{ creatorId: string }`
- **Response Interface**:
  ```typescript
  interface CreatorBasicResponse {
    id: string;
    name: string;
    type: 'organizer' | 'youtuber' | 'both';
    avatar?: string;
    socialMedia: SocialMedia[];
  }
  ```
- **Usage**: Creator information section
- **Caching**: 1 hour

#### `CreatorService.getCreatorStats()`
- **Purpose**: Get creator statistics for profile pages
- **Parameters**: `{ creatorId: string }`
- **Response Interface**:
  ```typescript
  interface CreatorStatsResponse {
    totalEvents: number;
    totalVideos: number;
    totalSeries: number;
    upcomingEvents: number;
    youtubeChannel?: {
      subscriberCount: number;
      videoCount: number;
    };
  }
  ```
- **Usage**: Creator profile pages
- **Caching**: 15 minutes

### Location Service

#### `LocationService.getLocationInfo()`
- **Purpose**: Get location details for offline events
- **Parameters**: `{ locationId: string }`
- **Response Interface**:
  ```typescript
  interface LocationResponse {
    id: string;
    buildingName: string;
    googleMapsUrl?: string;
    coordinates?: { lat: number; lng: number };
  }
  ```
- **Usage**: Location section (offline events only)
- **Caching**: 24 hours (locations rarely change)

### Speaker Service

#### `SpeakerService.getActivitySpeakers()`
- **Purpose**: Get speaker information for activity
- **Parameters**: `{ activityId: string }`
- **Response Interface**:
  ```typescript
  interface SpeakerResponse {
    id: string;
    name: string;
    avatar?: string;
    socialMedia: SocialMedia[];
  }[]
  ```
- **Usage**: Speaker information section
- **Caching**: 1 hour

### Website Service

#### `WebsiteService.getActivityLinks()`
- **Purpose**: Get all external links for activity
- **Parameters**: `{ activityId: string }`
- **Response Interface**:
  ```typescript
  interface WebsiteLinksResponse {
    websites: Website[];
    youtubeUrl?: string;
    videoId?: string;
    duration?: number;
    viewCount?: number;
  }
  ```
- **Usage**: Website links section, video information
- **Caching**: 30 minutes

### Search Service

#### `SearchService.searchActivities()`
- **Purpose**: Search activities with filters
- **Parameters**: `{ query: string, filters: SearchFilters }`
- **Response Interface**:
  ```typescript
  interface SearchResponse {
    activities: ActivitySearchResult[];
    totalCount: number;
    hasMore: boolean;
  }
  ```
- **Usage**: Home page search, calendar filtering
- **Caching**: 5 minutes

## Frontend Architecture

### UI/UX Design

#### Component Hierarchy
```
ActivityDetailPage
├── ActivityHeader (status, actions)
├── ActivityImage (primary visual)
├── ActivitySidebar
│   ├── CalendarButton (offline only)
│   ├── WebsiteLinks
│   ├── TicketInfo (if paid)
│   └── SpeakerList
└── ActivityMainContent
    ├── ActivityTitle
    ├── CreatorInfo
    ├── TimeDateInfo
    ├── LocationInfo (offline only)
    ├── Description
    ├── Schedule (offline only)
    └── RelatedActivities
```

#### Responsive Design
- **Mobile**: Single column, stacked layout
- **Tablet**: Two-column with sidebar below
- **Desktop**: Two-column with fixed sidebar

#### Visual Design
- **Status Badges**: Color-coded (red=live, green=upcoming, gray=past, blue=available)
- **Interaction Buttons**: Consistent icon set with hover effects
- **Loading States**: Skeleton loaders for each section
- **Error States**: Graceful fallbacks for failed requests

### Component Design

#### ActivityHeader Component
```typescript
interface ActivityHeaderProps {
  activity: ActivityDetailResponse;
  onSave: (saved: boolean) => void;
  onShare: () => void;
}
```
- **State**: `saved`, `sharing`
- **Services**: None (uses passed data)
- **Interactions**: Save toggle, share functionality

#### ActivityImage Component
```typescript
interface ActivityImageProps {
  images: string[];
  alt: string;
}
```
- **State**: `currentImage`, `loading`
- **Services**: None (uses passed data)
- **Interactions**: Image carousel, lazy loading

#### CreatorInfo Component
```typescript
interface CreatorInfoProps {
  creator: CreatorBasicResponse;
}
```
- **State**: `expanded`
- **Services**: None (uses passed data)
- **Interactions**: Expand/collapse, social media links

#### LocationInfo Component
```typescript
interface LocationInfoProps {
  location: LocationResponse;
}
```
- **State**: `mapVisible`
- **Services**: None (uses passed data)
- **Interactions**: Google Maps integration, directions

### Data Flow & API Integration

#### Initial Page Load
```typescript
const useActivityDetail = (activityId: string) => {
  const [activity, setActivity] = useState<ActivityDetailResponse | null>(null);
  const [creator, setCreator] = useState<CreatorBasicResponse | null>(null);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [speakers, setSpeakers] = useState<SpeakerResponse[]>([]);
  const [links, setLinks] = useState<WebsiteLinksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        // Primary data
        const [activityData, creatorData, speakersData, linksData] = await Promise.all([
          ActivityService.getActivityById(activityId),
          CreatorService.getCreatorBasicInfo(activityData.creatorId),
          SpeakerService.getActivitySpeakers(activityId),
          WebsiteService.getActivityLinks(activityId)
        ]);

        setActivity(activityData);
        setCreator(creatorData);
        setSpeakers(speakersData);
        setLinks(linksData);

        // Location data (if offline event)
        if (activityData.type === 'offline' && activityData.locationId) {
          const locationData = await LocationService.getLocationInfo(activityData.locationId);
          setLocation(locationData);
        }

        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    };

    loadActivityData();
  }, [activityId]);

  return { activity, creator, location, speakers, links, loading };
};
```

#### Lazy Loading
```typescript
const useRelatedActivities = (activityId: string) => {
  const [relatedActivities, setRelatedActivities] = useState<RelatedActivitiesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRelatedActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ActivityService.getRelatedActivities(activityId, 6);
      setRelatedActivities(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  return { relatedActivities, loading, loadRelatedActivities };
};
```

### UI Behavior & Interaction

#### Save Functionality
```typescript
const useSaveActivity = (activityId: string) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (saved) {
        await UserService.removeSavedActivity(activityId);
        setSaved(false);
      } else {
        await UserService.saveActivity(activityId);
        setSaved(true);
      }
    } catch (error) {
      // Handle error
    } finally {
      setSaving(false);
    }
  }, [activityId, saved]);

  return { saved, saving, toggleSave };
};
```

#### Share Functionality
```typescript
const useShareActivity = (activity: ActivityDetailResponse) => {
  const share = useCallback(async () => {
    const shareData = {
      title: activity.name,
      text: activity.description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  }, [activity]);

  return { share };
};
```

#### Real-time Status Updates
```typescript
const useActivityStatus = (activity: ActivityDetailResponse) => {
  const [status, setStatus] = useState(activity.status);

  useEffect(() => {
    if (activity.status === 'upcoming') {
      const interval = setInterval(() => {
        const now = new Date();
        const startDate = new Date(activity.startDate);
        const endDate = activity.endDate ? new Date(activity.endDate) : null;

        if (now >= startDate && (!endDate || now <= endDate)) {
          setStatus('live');
        } else if (endDate && now > endDate) {
          setStatus('past');
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [activity]);

  return status;
};
```

### Performance & Constraints

#### Loading Performance
- **Critical Path**: Activity data loads first (above the fold)
- **Progressive Loading**: Images load after text content
- **Lazy Loading**: Related activities load when scrolled into view
- **Caching**: Service responses cached to reduce API calls

#### Memory Management
- **Component Cleanup**: Proper cleanup of intervals and event listeners
- **State Optimization**: Minimal state updates to prevent unnecessary re-renders
- **Image Optimization**: Next.js Image component with lazy loading

#### Error Handling
- **Service Errors**: Graceful fallbacks for failed API calls
- **Network Errors**: Retry logic with exponential backoff
- **User Feedback**: Loading states and error messages

#### Accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Logical tab order and focus indicators

#### Mobile Optimization
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Image carousel with swipe support
- **Performance**: Optimized for mobile networks and devices

## Implementation Status

### Completed Services
- ✅ ActivityService.getActivityById()
- ✅ CreatorService.getCreatorBasicInfo()
- ✅ LocationService.getLocationInfo()
- ✅ SpeakerService.getActivitySpeakers()
- ✅ WebsiteService.getActivityLinks()

### In Progress
- 🔄 ActivityService.getRelatedActivities()
- 🔄 SearchService.searchActivities()
- 🔄 UserService.saveActivity()

### Planned
- 📋 CreatorService.getCreatorStats()
- 📋 Real-time status updates
- 📋 Advanced caching strategies

---

*This service design specification provides a comprehensive architecture for efficient data fetching and optimal frontend performance in the LNConnext activity detail page.*
