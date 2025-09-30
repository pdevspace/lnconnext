# Bitcoiner Service Implementation

## Overview

This document provides instructions for setting up and using the Bitcoiner service that connects to MongoDB using Prisma ORM through server-side API routes. The service provides full CRUD operations for managing bitcoiner profiles with social media links.

## Features

- ✅ **Server-Side API Routes**: Prisma runs on server-side, frontend uses API routes
- ✅ **Full CRUD Operations**: Create, Read, Update, Delete bitcoiner profiles
- ✅ **Social Media Management**: Dynamic social media links with platform support
- ✅ **Search & Filtering**: Search by name and filter by social media platform
- ✅ **Responsive Design**: Mobile-first design with dark mode support
- ✅ **Type Safety**: Full TypeScript implementation with validation

## Prerequisites

1. **MongoDB Atlas Account**: You need a MongoDB Atlas cluster
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## Setup Instructions

### 1. Environment Configuration

Update your `.env` file with the correct MongoDB Atlas connection string:

```env
# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
DATABASE_URL="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/lnconnext?retryWrites=true&w=majority"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

**Important**: Make sure your MongoDB Atlas connection string includes the database name (`lnconnext` in this case).

### 2. Database Setup

Push the Prisma schema to your MongoDB Atlas database:

```bash
npx prisma db push
```

### 3. Generate Prisma Client

Generate the Prisma client:

```bash
npm run db:generate
```

### 4. Seed Initial Data

Populate the database with sample bitcoiner data:

```bash
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

## Usage

### Access the Bitcoiner Service

Navigate to `http://localhost:3000/bitcoiner` to access the bitcoiner management interface.

### Available Pages

1. **List Page** (`/bitcoiner`): View all bitcoiners with search and filtering
2. **Create Page** (`/bitcoiner/create`): Add new bitcoiner profiles
3. **Detail Page** (`/bitcoiner/[id]`): View individual bitcoiner details
4. **Edit Page** (`/bitcoiner/edit/[id]`): Edit existing bitcoiner profiles

### Features

#### Search & Filtering
- **Search**: Search bitcoiners by name
- **Platform Filter**: Filter by social media platform (Facebook, YouTube, Twitter, LinkedIn, Instagram)

#### Social Media Management
- **Add Links**: Add multiple social media links per bitcoiner
- **Platform Support**: Facebook, YouTube, Twitter, LinkedIn, Instagram
- **Validation**: URL validation and required field checking

#### CRUD Operations
- **Create**: Add new bitcoiner profiles with social media links
- **Read**: View bitcoiner lists and individual profiles
- **Update**: Edit existing bitcoiner information
- **Delete**: Remove bitcoiner profiles (with confirmation)

## Technical Architecture

### Database Schema

```prisma
model Bitcoiner {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  socialMedia SocialMedia[]
  bio         String?
  avatar      String?
  expertise   String[]
  location    String?
  website     String?
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("bitcoiners")
}

model SocialMedia {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  displayText String
  username    String
  platform    String
  urlLink     String
  bitcoinerId String    @db.ObjectId
  bitcoiner   Bitcoiner @relation(fields: [bitcoinerId], references: [id], onDelete: Cascade)

  @@map("social_media")
}
```

### Service Layer

The `BitcoinerService` class provides server-side database access methods (used by API routes):

```typescript
class BitcoinerService {
  static async getAllBitcoiners(filters?: {
    search?: string;
    platform?: string;
  }): Promise<Bitcoiner[]>

  static async getBitcoinerById(id: string): Promise<Bitcoiner | null>

  static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner>

  static async updateBitcoiner(id: string, data: BitcoinerFormData): Promise<Bitcoiner | null>

  static async deleteBitcoiner(id: string): Promise<boolean>

  static async searchBitcoiners(query: string): Promise<Bitcoiner[]>

  static async filterByPlatform(platform: string): Promise<Bitcoiner[]>
}
```

### React Hooks

Custom hooks for data management (use API routes):

- `useBitcoiners()`: Manage list of bitcoiners with filtering
- `useBitcoiner(id)`: Manage individual bitcoiner data

### API Routes

Server-side API routes that use Prisma:

- `GET /api/bitcoiner` - List all bitcoiners with optional filtering
- `POST /api/bitcoiner/create` - Create new bitcoiner
- `GET /api/bitcoiner/[id]` - Get single bitcoiner
- `PUT /api/bitcoiner/[id]` - Update bitcoiner
- `DELETE /api/bitcoiner/[id]` - Delete bitcoiner

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── bitcoiner/
│   │       ├── route.ts                    # GET /api/bitcoiner
│   │       ├── create/route.ts             # POST /api/bitcoiner/create
│   │       └── [id]/route.ts               # GET/PUT/DELETE /api/bitcoiner/[id]
│   └── bitcoiner/
│       ├── page.tsx                        # List page
│       ├── create/page.tsx                 # Create page
│       └── [id]/
│           ├── page.tsx                    # Detail page
│           └── edit/page.tsx               # Edit page
├── components/
│   ├── pages/bitcoiner/
│   │   ├── BitcoinerListPage.tsx           # List component
│   │   ├── BitcoinerCard.tsx               # Card component
│   │   ├── BitcoinerDetailPage.tsx         # Detail component
│   │   ├── BitcoinerForm.tsx               # Form component
│   │   ├── BitcoinerFilters.tsx            # Filter component
│   │   └── SocialMediaCard.tsx             # Social media component
│   └── ui/
│       ├── social-icon.tsx                 # Platform icons
│       ├── select.tsx                      # Select component
│       └── label.tsx                       # Label component
├── data/
│   └── BitcoinerService.ts                 # Database service
├── hooks/
│   └── useBitcoiner.ts                     # React hooks
├── lib/
│   ├── prisma.ts                          # Prisma client
│   └── validations.ts                     # Validations
└── types/
    └── bitcoiner.ts                       # TypeScript interfaces
```

## Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:push            # Push schema to database
npm run db:generate        # Generate Prisma client
npm run db:seed            # Seed initial data

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors
npm run format             # Format code with Prettier
npm run type-check         # TypeScript type checking
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure your MongoDB Atlas connection string includes the database name
2. **Prisma Client Error**: Run `npm run db:generate` after schema changes
3. **TypeScript Errors**: Run `npm run type-check` to identify type issues

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get the connection string and update your `.env` file

## Next Steps

1. **Authentication**: Add user authentication and authorization
2. **File Upload**: Implement avatar image upload
3. **Advanced Filtering**: Add more filter options (expertise, location, etc.)
4. **Pagination**: Implement pagination for large datasets
5. **Real-time Updates**: Add WebSocket support for real-time updates

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your MongoDB Atlas connection
3. Ensure all dependencies are installed
4. Check the Prisma documentation for database-specific issues
