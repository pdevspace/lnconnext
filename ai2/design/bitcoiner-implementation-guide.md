# Bitcoiner Project Implementation Guide

## Overview

This document provides the specific implementation details for the Bitcoiner project using the MongoDB + Prisma + API template.

## Project Structure

```
src/
├── prisma/
│   ├── prisma.ts                    # Prisma client configuration
│   └── BitcoinerService.ts          # Database service layer
├── model/
│   ├── bitcoiner.ts                 # TypeScript interfaces
│   ├── service/
│   │   └── useBitcoiner.ts          # React hooks
│   └── validation/
│       └── bitcoiner.ts             # Zod schemas
├── app/api/bitcoiner/
│   ├── list/route.ts                # POST /api/bitcoiner/list
│   ├── get/route.ts                 # POST /api/bitcoiner/get
│   ├── create/route.ts              # POST /api/bitcoiner/create
│   ├── update/route.ts              # POST /api/bitcoiner/update
│   └── delete/route.ts              # POST /api/bitcoiner/delete
└── components/pages/bitcoiner/
    ├── BitcoinerListPage.tsx
    ├── BitcoinerDetailPage.tsx
    ├── BitcoinerForm.tsx
    ├── BitcoinerCard.tsx
    ├── BitcoinerFilters.tsx
    └── SocialMediaCard.tsx

prisma/
└── schema.prisma                    # Database schema

scripts/
└── seed-bitcoiners.ts               # Database seeding script

.env.local                           # Environment variables
```

## Database Schema

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

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

## TypeScript Interfaces

### `src/model/bitcoiner.ts`

```typescript
export interface Bitcoiner {
  id: string;
  name: string;
  socialMedia: SocialMedia[];
  bio?: string;
  avatar?: string;
  expertise?: string[];
  location?: string;
  website?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialMedia {
  id: string;
  displayText: string;
  username: string;
  platform: string;
  urlLink: string;
}

export interface BitcoinerFormData {
  name: string;
  socialMedia: SocialMedia[];
  bio?: string;
  avatar?: string;
  expertise?: string[];
  location?: string;
  website?: string;
}

export interface BitcoinerFilters {
  searchTerm: string;
  selectedPlatform: string;
}

export type Platform = 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram';

export const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
] as const;
```

## Validation Schema

### `src/model/validation/bitcoiner.ts`

```typescript
import { z } from 'zod';

const socialMediaSchema = z.object({
  id: z.string().optional(),
  displayText: z.string().min(1, 'Display text is required'),
  username: z.string().min(1, 'Username is required'),
  platform: z.string().min(1, 'Platform is required'),
  urlLink: z.string().url('Must be a valid URL'),
});

export const bitcoinerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  socialMedia: z.array(socialMediaSchema),
  bio: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  expertise: z.array(z.string()).optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export type BitcoinerFormData = z.infer<typeof bitcoinerSchema>;
```

## Database Service

### `src/prisma/BitcoinerService.ts`

```typescript
import { Bitcoiner, BitcoinerFormData } from '@/model/bitcoiner';
import { prisma } from '@/prisma/prisma';

export class BitcoinerService {
  static async getAllBitcoiners(filters?: {
    search?: string;
    platform?: string;
  }): Promise<Bitcoiner[]> {
    try {
      const where: any = {};

      if (filters?.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      if (filters?.platform) {
        where.socialMedia = {
          some: {
            platform: filters.platform
          }
        };
      }

      const bitcoiners = await prisma.bitcoiner.findMany({
        where,
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return bitcoiners.map((bitcoiner: any) => ({
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink
        })),
        bio: bitcoiner.bio,
        avatar: bitcoiner.avatar,
        expertise: bitcoiner.expertise,
        location: bitcoiner.location,
        website: bitcoiner.website,
        isActive: bitcoiner.isActive,
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching bitcoiners:', error);
      throw new Error('Failed to fetch bitcoiners');
    }
  }

  static async getBitcoinerById(id: string): Promise<Bitcoiner | null> {
    try {
      const bitcoiner = await prisma.bitcoiner.findUnique({
        where: { id },
        include: {
          socialMedia: true
        }
      });

      if (!bitcoiner) return null;

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink
        })),
        bio: bitcoiner.bio,
        avatar: bitcoiner.avatar,
        expertise: bitcoiner.expertise,
        location: bitcoiner.location,
        website: bitcoiner.website,
        isActive: bitcoiner.isActive,
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error fetching bitcoiner:', error);
      throw new Error('Failed to fetch bitcoiner');
    }
  }

  static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner> {
    try {
      const bitcoiner = await prisma.bitcoiner.create({
        data: {
          name: data.name,
          bio: data.bio,
          avatar: data.avatar,
          expertise: data.expertise || [],
          location: data.location,
          website: data.website,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink
            }))
          }
        },
        include: {
          socialMedia: true
        }
      });

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink
        })),
        bio: bitcoiner.bio,
        avatar: bitcoiner.avatar,
        expertise: bitcoiner.expertise,
        location: bitcoiner.location,
        website: bitcoiner.website,
        isActive: bitcoiner.isActive,
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error creating bitcoiner:', error);
      throw new Error('Failed to create bitcoiner');
    }
  }

  static async updateBitcoiner(id: string, data: BitcoinerFormData): Promise<Bitcoiner | null> {
    try {
      // First, delete existing social media
      await prisma.socialMedia.deleteMany({
        where: { bitcoinerId: id }
      });

      // Then update the bitcoiner with new social media
      const bitcoiner = await prisma.bitcoiner.update({
        where: { id },
        data: {
          name: data.name,
          bio: data.bio,
          avatar: data.avatar,
          expertise: data.expertise || [],
          location: data.location,
          website: data.website,
          socialMedia: {
            create: data.socialMedia.map(social => ({
              displayText: social.displayText,
              username: social.username,
              platform: social.platform,
              urlLink: social.urlLink
            }))
          }
        },
        include: {
          socialMedia: true
        }
      });

      return {
        id: bitcoiner.id,
        name: bitcoiner.name,
        socialMedia: bitcoiner.socialMedia.map((social: any) => ({
          id: social.id,
          displayText: social.displayText,
          username: social.username,
          platform: social.platform,
          urlLink: social.urlLink
        })),
        bio: bitcoiner.bio,
        avatar: bitcoiner.avatar,
        expertise: bitcoiner.expertise,
        location: bitcoiner.location,
        website: bitcoiner.website,
        isActive: bitcoiner.isActive,
        createdAt: bitcoiner.createdAt,
        updatedAt: bitcoiner.updatedAt
      };
    } catch (error) {
      console.error('Error updating bitcoiner:', error);
      throw new Error('Failed to update bitcoiner');
    }
  }

  static async deleteBitcoiner(id: string): Promise<boolean> {
    try {
      await prisma.bitcoiner.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting bitcoiner:', error);
      throw new Error('Failed to delete bitcoiner');
    }
  }
}
```

## API Endpoints

### List Bitcoiners: `POST /api/bitcoiner/list`

**Request:**
```json
{
  "search": "optional search term",
  "platform": "optional platform filter"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "68d646cc14189f98f56b1fee",
      "name": "อ.พิริยะ",
      "socialMedia": [
        {
          "id": "social-1",
          "displayText": "เพจ อ.พิริยะ",
          "username": "piriyat_official",
          "platform": "facebook",
          "urlLink": "https://web.facebook.com/piriyat_official"
        }
      ],
      "bio": "Bitcoin educator",
      "avatar": "https://example.com/avatar.jpg",
      "expertise": ["Bitcoin", "Education"],
      "location": "Bangkok",
      "website": "https://example.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Found 1 bitcoiners"
}
```

### Get Single Bitcoiner: `POST /api/bitcoiner/get`

**Request:**
```json
{
  "id": "68d646cc14189f98f56b1fee"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "68d646cc14189f98f56b1fee",
    "name": "อ.พิริยะ",
    "socialMedia": [...],
    "bio": "Bitcoin educator",
    "avatar": "https://example.com/avatar.jpg",
    "expertise": ["Bitcoin", "Education"],
    "location": "Bangkok",
    "website": "https://example.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Bitcoiner retrieved successfully"
}
```

### Create Bitcoiner: `POST /api/bitcoiner/create`

**Request:**
```json
{
  "name": "อ.พิริยะ",
  "socialMedia": [
    {
      "displayText": "เพจ อ.พิริยะ",
      "username": "piriyat_official",
      "platform": "facebook",
      "urlLink": "https://web.facebook.com/piriyat_official"
    }
  ],
  "bio": "Bitcoin educator",
  "avatar": "https://example.com/avatar.jpg",
  "expertise": ["Bitcoin", "Education"],
  "location": "Bangkok",
  "website": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "68d646cc14189f98f56b1fee",
    "name": "อ.พิริยะ",
    "socialMedia": [...],
    "bio": "Bitcoin educator",
    "avatar": "https://example.com/avatar.jpg",
    "expertise": ["Bitcoin", "Education"],
    "location": "Bangkok",
    "website": "https://example.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Bitcoiner created successfully"
}
```

### Update Bitcoiner: `POST /api/bitcoiner/update`

**Request:**
```json
{
  "id": "68d646cc14189f98f56b1fee",
  "name": "อ.พิริยะ (Updated)",
  "socialMedia": [...],
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg",
  "expertise": ["Bitcoin", "Education", "Blockchain"],
  "location": "Chiang Mai",
  "website": "https://updated-example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "68d646cc14189f98f56b1fee",
    "name": "อ.พิริยะ (Updated)",
    "socialMedia": [...],
    "bio": "Updated bio",
    "avatar": "https://example.com/new-avatar.jpg",
    "expertise": ["Bitcoin", "Education", "Blockchain"],
    "location": "Chiang Mai",
    "website": "https://updated-example.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Bitcoiner updated successfully"
}
```

### Delete Bitcoiner: `POST /api/bitcoiner/delete`

**Request:**
```json
{
  "id": "68d646cc14189f98f56b1fee"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true
  },
  "message": "Bitcoiner deleted successfully"
}
```

## Database Seeding

### `scripts/seed-bitcoiners.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBitcoiners() {
  try {
    // Clear existing data
    await prisma.socialMedia.deleteMany();
    await prisma.bitcoiner.deleteMany();

    // Create bitcoiners with social media
    const bitcoiners = [
      {
        name: 'อ.พิริยะ',
        bio: 'Bitcoin educator and researcher',
        expertise: ['Bitcoin', 'Education', 'Research'],
        location: 'Bangkok',
        website: 'https://piriyat.com',
        socialMedia: [
          {
            displayText: 'เพจ อ.พิริยะ',
            username: 'piriyat_official',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/piriyat_official'
          }
        ]
      },
      {
        name: 'อ.วิชิต',
        bio: 'Bitcoin content creator',
        expertise: ['Bitcoin', 'Content Creation', 'YouTube'],
        location: 'Chiang Mai',
        website: 'https://vichitbitcoin.com',
        socialMedia: [
          {
            displayText: 'YouTube อ.วิชิต',
            username: 'VichitBitcoin',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/@VichitBitcoin'
          }
        ]
      }
    ];

    for (const bitcoinerData of bitcoiners) {
      const { socialMedia, ...bitcoinerInfo } = bitcoinerData;
      
      await prisma.bitcoiner.create({
        data: {
          ...bitcoinerInfo,
          socialMedia: {
            create: socialMedia
          }
        }
      });
    }

    console.log(`✅ Seeded ${bitcoiners.length} bitcoiners`);
  } catch (error) {
    console.error('❌ Error seeding bitcoiners:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedBitcoiners()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Setup Commands

```bash
# 1. Install dependencies
yarn add prisma @prisma/client zod

# 2. Generate Prisma client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Seed the database
npx tsx scripts/seed-bitcoiners.ts

# 5. Start development server
yarn dev
```

## Testing API Endpoints

```bash
# List all bitcoiners
curl -X POST http://localhost:3000/api/bitcoiner/list \
  -H "Content-Type: application/json" \
  -d '{}'

# Search bitcoiners
curl -X POST http://localhost:3000/api/bitcoiner/list \
  -H "Content-Type: application/json" \
  -d '{"search": "พิริยะ"}'

# Filter by platform
curl -X POST http://localhost:3000/api/bitcoiner/list \
  -H "Content-Type: application/json" \
  -d '{"platform": "facebook"}'

# Get single bitcoiner
curl -X POST http://localhost:3000/api/bitcoiner/get \
  -H "Content-Type: application/json" \
  -d '{"id": "68d646cc14189f98f56b1fee"}'

# Create new bitcoiner
curl -X POST http://localhost:3000/api/bitcoiner/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bitcoiner",
    "socialMedia": [
      {
        "displayText": "Test Social",
        "username": "test_user",
        "platform": "twitter",
        "urlLink": "https://twitter.com/test_user"
      }
    ]
  }'
```

This implementation provides a complete, production-ready Bitcoiner management system with full CRUD operations, validation, and error handling.
