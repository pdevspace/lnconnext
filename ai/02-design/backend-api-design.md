# Backend API Design

## Overview
The backend is built with Next.js API routes, Prisma ORM, and MongoDB. It follows RESTful principles with consistent error handling, validation, and response formats.

## API Architecture

### Base Structure
```
src/app/api/
├── bitcoiner/
│   ├── create/route.ts
│   ├── delete/route.ts
│   ├── get/route.ts
│   ├── list/route.ts
│   └── update/route.ts
├── event/
│   ├── get/route.ts
│   ├── list/route.ts
│   ├── past/route.ts
│   ├── search/route.ts
│   └── upcoming/route.ts
└── organizer/
    ├── create/route.ts
    ├── delete/route.ts
    ├── events/route.ts
    ├── get/route.ts
    ├── list/route.ts
    ├── search/route.ts
    ├── stats/route.ts
    └── update/route.ts
```

## Service Layer Architecture

### Service Classes
Each entity has a dedicated service class handling business logic:

1. **BitcoinerService** - Manages bitcoiner data and relationships
2. **EventService** - Handles event operations and complex queries
3. **OrganizerService** - Manages organizer data and statistics

### Service Methods

#### BitcoinerService
```typescript
class BitcoinerService {
  // CRUD Operations
  static async getBitcoinerById(id: string): Promise<Bitcoiner | null>
  static async getAllBitcoiners(filters: BitcoinerFilters): Promise<Bitcoiner[]>
  static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner>
  static async updateBitcoiner(id: string, data: BitcoinerFormData): Promise<Bitcoiner | null>
  static async deleteBitcoiner(id: string): Promise<boolean>
  
  // Search and Filtering
  static async searchBitcoiners(query: string, filters: BitcoinerFilters): Promise<Bitcoiner[]>
}
```

#### EventService
```typescript
class EventService {
  // CRUD Operations
  static async getEventById(id: string): Promise<Event | null>
  static async getEvents(filters: EventFilters): Promise<Event[]>
  
  // Specialized Queries
  static async getUpcomingEvents(limit: number): Promise<Event[]>
  static async getPastEvents(limit: number): Promise<Event[]>
  static async searchEvents(query: string, filters: EventFilters): Promise<Event[]>
}
```

#### OrganizerService
```typescript
class OrganizerService {
  // CRUD Operations
  static async getOrganizerById(id: string): Promise<Organizer | null>
  static async getAllOrganizers(filters: OrganizerFilters): Promise<Organizer[]>
  static async createOrganizer(data: OrganizerFormData): Promise<Organizer>
  static async updateOrganizer(id: string, data: OrganizerFormData): Promise<Organizer | null>
  static async deleteOrganizer(id: string): Promise<boolean>
  
  // Specialized Operations
  static async getOrganizerEvents(organizerId: string): Promise<Event[]>
  static async getOrganizerStats(organizerId: string): Promise<OrganizerStats>
  static async searchOrganizers(query: string, filters: OrganizerFilters): Promise<Organizer[]>
}
```

## API Endpoints

### Bitcoiner Endpoints

#### GET /api/bitcoiner/get/
**Purpose**: Retrieve a specific bitcoiner by ID
**Method**: POST
**Request Body**:
```json
{
  "bitcoinerId": "string"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "bio": "string",
    "avatar": "string",
    "expertise": ["string"],
    "isActive": boolean,
    "socialMedia": [...],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

#### POST /api/bitcoiner/list/
**Purpose**: List bitcoiners with filtering and pagination
**Request Body**:
```json
{
  "filters": {
    "searchTerm": "string",
    "selectedPlatform": "string",
    "limit": number,
    "offset": number
  }
}
```

#### POST /api/bitcoiner/create/
**Purpose**: Create a new bitcoiner
**Request Body**:
```json
{
  "name": "string",
  "socialMedia": [
    {
      "displayText": "string",
      "username": "string",
      "platform": "string",
      "urlLink": "string"
    }
  ]
}
```

#### POST /api/bitcoiner/update/
**Purpose**: Update an existing bitcoiner
**Request Body**:
```json
{
  "id": "string",
  "name": "string",
  "socialMedia": [...]
}
```

#### POST /api/bitcoiner/delete/
**Purpose**: Delete a bitcoiner
**Request Body**:
```json
{
  "id": "string"
}
```

### Event Endpoints

#### POST /api/event/get/
**Purpose**: Retrieve a specific event by ID
**Request Body**:
```json
{
  "eventId": "string"
}
```

#### POST /api/event/list/
**Purpose**: List events with filtering
**Request Body**:
```json
{
  "filters": {
    "search": "string",
    "organizerId": "string",
    "speakerId": "string",
    "dateFrom": "datetime",
    "dateTo": "datetime",
    "limit": number,
    "offset": number
  }
}
```

#### POST /api/event/upcoming/
**Purpose**: Get upcoming events
**Request Body**:
```json
{
  "limit": number
}
```

#### POST /api/event/past/
**Purpose**: Get past events
**Request Body**:
```json
{
  "limit": number
}
```

#### POST /api/event/search/
**Purpose**: Search events by query
**Request Body**:
```json
{
  "query": "string",
  "filters": {...}
}
```

### Organizer Endpoints

#### POST /api/organizer/get/
**Purpose**: Retrieve a specific organizer by ID
**Request Body**:
```json
{
  "organizerId": "string"
}
```

#### POST /api/organizer/list/
**Purpose**: List organizers with filtering
**Request Body**:
```json
{
  "filters": {
    "search": "string",
    "isActive": boolean,
    "hasEvents": boolean,
    "limit": number,
    "offset": number
  }
}
```

#### POST /api/organizer/create/
**Purpose**: Create a new organizer
**Request Body**:
```json
{
  "name": "string",
  "bio": "string",
  "avatar": "string",
  "website": "string",
  "isActive": boolean,
  "socialMediaIds": ["string"]
}
```

#### POST /api/organizer/update/
**Purpose**: Update an existing organizer
**Request Body**:
```json
{
  "organizerId": "string",
  "name": "string",
  "bio": "string",
  "avatar": "string",
  "website": "string",
  "isActive": boolean,
  "socialMediaIds": ["string"]
}
```

#### POST /api/organizer/delete/
**Purpose**: Delete an organizer
**Request Body**:
```json
{
  "organizerId": "string"
}
```

#### POST /api/organizer/events/
**Purpose**: Get events for a specific organizer
**Request Body**:
```json
{
  "organizerId": "string"
}
```

#### POST /api/organizer/stats/
**Purpose**: Get organizer statistics
**Request Body**:
```json
{
  "organizerId": "string"
}
```

#### POST /api/organizer/search/
**Purpose**: Search organizers by query
**Request Body**:
```json
{
  "query": "string",
  "filters": {...}
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "string",
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "hasMore": boolean
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "string",
  "message": "string",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

## Validation

### Frontend Validation
- Real-time form validation using custom validators
- Type-safe validation with TypeScript interfaces
- Client-side validation for immediate feedback

### Backend Validation
- Server-side validation using `validateApiRequest`
- Database constraint validation
- Business logic validation in service layer

### Validation Rules

#### Bitcoiner Validation
- Name: Required, 2-100 characters
- Social Media: Platform-specific URL validation
- Username: Required for social media entries

#### Event Validation
- Name: Required, 2-200 characters
- Description: Required, 10-1000 characters
- Start Date: Required, must be in future for new events
- End Date: Optional, must be after start date
- Price: Non-negative number

#### Organizer Validation
- Name: Required, 2-100 characters
- Bio: Optional, max 500 characters
- Website: Valid URL format
- Avatar: Valid URL format

## Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Error Types
1. **Validation Errors**: Field-specific validation failures
2. **Not Found Errors**: Resource doesn't exist
3. **Database Errors**: Connection or query failures
4. **Business Logic Errors**: Constraint violations

### Error Logging
- Console logging for development
- Structured error logging for production
- Error context preservation

## Security

### Input Sanitization
- SQL injection prevention through Prisma ORM
- XSS prevention through input sanitization
- URL validation for external links

### Authentication
- Currently no authentication (public API)
- Future: JWT-based authentication
- Role-based access control planned

### Rate Limiting
- Future: API rate limiting implementation
- Request throttling for expensive operations

## Performance Optimizations

### Database Queries
- Efficient Prisma queries with proper includes
- Pagination for large datasets
- Indexed queries for common operations

### Caching
- Future: Redis caching for frequently accessed data
- Static generation for public pages
- ISR (Incremental Static Regeneration) for dynamic content

### Response Optimization
- Minimal data transfer with selective field inclusion
- Compressed responses
- Efficient serialization

## Future Enhancements

### Planned Features
1. **Authentication & Authorization**
   - JWT-based user authentication
   - Role-based access control
   - API key management

2. **Advanced Search**
   - Full-text search with MongoDB Atlas Search
   - Faceted search capabilities
   - Search analytics

3. **Real-time Features**
   - WebSocket support for live updates
   - Real-time event notifications
   - Live chat integration

4. **Analytics & Reporting**
   - Event attendance tracking
   - User engagement metrics
   - Custom reporting dashboard

5. **File Upload**
   - Image upload for avatars and event images
   - Document upload for event materials
   - CDN integration for media delivery
