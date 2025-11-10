# Database Schema Design

## Overview

The application uses MongoDB with Prisma ORM for data persistence. The schema is designed to support a Bitcoin community event management platform with three main entities: Bitcoiners, Organizers, and Events.

## Core Entities

### 1. Bitcoiner

**Purpose**: Represents community members who can participate in events as speakers or attendees.

**Schema**:

```prisma
model Bitcoiner {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  bio         String?
  avatar      String?
  expertise   String[]      // Array of expertise areas
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  socialMedia SocialMedia[] @relation("BitcoinerSocialMedia")
  eventBitcoiners EventBitcoiner[]
  sectionBitcoiners SectionBitcoiner[]
}
```

**Key Features**:

- Flexible expertise tracking with string arrays
- Social media integration through polymorphic relationship
- Many-to-many relationship with events (as speakers/attendees)
- Soft delete capability with isActive flag

### 2. Organizer

**Purpose**: Represents event organizers who create and manage events.

**Schema**:

```prisma
model Organizer {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  bio         String?
  avatar      String?
  website     String?
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  socialMedia SocialMedia[] @relation("OrganizerSocialMedia")
  events      Event[]
}
```

**Key Features**:

- One-to-many relationship with events
- Social media integration
- Website field for external links
- Soft delete capability

### 3. Event

**Purpose**: Represents Bitcoin community events with detailed scheduling and speaker management.

**Schema**:

```prisma
model Event {
  id               String         @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  description      String
  eventSeriesName  String?        // For recurring events
  startDate        DateTime
  endDate          DateTime?      // Optional end date
  price            Float          @default(0)
  images           String[]       // Array of image URLs
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  // Relations
  organizerId      String         @db.ObjectId
  organizer        Organizer      @relation(fields: [organizerId], references: [id], onDelete: Cascade)

  locationId       String?        @db.ObjectId
  location         Location?      @relation(fields: [locationId], references: [id], onDelete: Restrict)

  sections         EventSection[]
  eventBitcoiners  EventBitcoiner[]
  websites         Website[]      @relation("EventWebsites")
}
```

**Key Features**:

- Hierarchical event structure with sections
- Flexible pricing (free events supported)
- Multiple image support
- Optional location integration
- Website links for external resources

## Supporting Entities

### 4. Location

**Purpose**: Physical venues for events with geospatial data.

**Schema**:

```prisma
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
}
```

**Key Features**:

- Geospatial coordinates for mapping
- Google Maps integration
- Hierarchical address structure

### 5. EventSection

**Purpose**: Sub-events or sessions within a larger event.

**Schema**:

```prisma
model EventSection {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  sectionName String
  startTime   DateTime
  endTime     DateTime
  spot        String    // Physical location within venue
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  eventId     String    @db.ObjectId
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  sectionBitcoiners SectionBitcoiner[]
}
```

**Key Features**:

- Time-based scheduling within events
- Specific spot/location within venue
- Many-to-many relationship with speakers

### 6. SocialMedia

**Purpose**: Polymorphic social media links for both Bitcoiners and Organizers.

**Schema**:

```prisma
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

  // Relations
  bitcoiner   Bitcoiner? @relation("BitcoinerSocialMedia", fields: [ownerId], references: [id], onDelete: Cascade)
  organizer   Organizer? @relation("OrganizerSocialMedia", fields: [ownerId], references: [id], onDelete: Cascade)
}
```

**Key Features**:

- Polymorphic relationship design
- Platform-agnostic structure
- Cascade delete for data integrity

### 7. Website

**Purpose**: External website links for events.

**Schema**:

```prisma
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
}
```

## Junction Tables

### EventBitcoiner

**Purpose**: Many-to-many relationship between events and bitcoiners.

```prisma
model EventBitcoiner {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  eventId     String    @db.ObjectId
  bitcoinerId String    @db.ObjectId
  createdAt   DateTime  @default(now())

  // Relations
  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  bitcoiner   Bitcoiner @relation(fields: [bitcoinerId], references: [id], onDelete: Cascade)

  @@unique([eventId, bitcoinerId])
}
```

### SectionBitcoiner

**Purpose**: Many-to-many relationship between event sections and bitcoiners.

```prisma
model SectionBitcoiner {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  sectionId   String    @db.ObjectId
  bitcoinerId String    @db.ObjectId
  createdAt   DateTime  @default(now())

  // Relations
  section     EventSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  bitcoiner   Bitcoiner    @relation(fields: [bitcoinerId], references: [id], onDelete: Cascade)

  @@unique([sectionId, bitcoinerId])
}
```

## Design Patterns

### 1. Polymorphic Relationships

- SocialMedia entity uses polymorphic design for both Bitcoiners and Organizers
- Single table with ownerType discriminator field

### 2. Soft Deletes

- isActive boolean flags instead of hard deletes
- Preserves data integrity and audit trails

### 3. Audit Fields

- createdAt and updatedAt timestamps on all entities
- Automatic timestamp management through Prisma

### 4. Cascade Deletes

- Proper cascade relationships for data integrity
- Restrict relationships where appropriate (e.g., Location → Event)

### 5. Unique Constraints

- Junction tables have unique constraints on foreign key combinations
- Prevents duplicate relationships

## Indexing Strategy

### Recommended Indexes

1. **Event queries**: `startDate`, `organizerId`
2. **Social media queries**: `ownerId`, `ownerType`
3. **Location queries**: `city`, `country`
4. **Bitcoiner queries**: `isActive`, `name`

### MongoDB-Specific Optimizations

- ObjectId primary keys for efficient queries
- Compound indexes for complex queries
- Sparse indexes for optional fields

## Data Relationships

```
Organizer (1) ──→ (N) Event
Event (1) ──→ (N) EventSection
Event (N) ──→ (N) Bitcoiner (through EventBitcoiner)
EventSection (N) ──→ (N) Bitcoiner (through SectionBitcoiner)
Event (1) ──→ (0..1) Location
Event (1) ──→ (N) Website
Bitcoiner (1) ──→ (N) SocialMedia
Organizer (1) ──→ (N) SocialMedia
```

## Scalability Considerations

### Read Optimization

- Denormalized data in junction tables for faster queries
- Strategic use of MongoDB's embedded documents

### Write Optimization

- Batch operations for bulk data updates
- Efficient cascade delete strategies

### Future Enhancements

- Event series support for recurring events
- Advanced geospatial queries for location-based features
- Event analytics and reporting tables
