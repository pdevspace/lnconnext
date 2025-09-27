# MongoDB + Prisma + API Template Design Specification

## Overview

This is a reusable template for creating MongoDB + Prisma + API projects with action-based endpoints. This design can be copied and adapted for any entity management system.

## Architecture Pattern

```
Frontend (React/Next.js)
    ↓
API Routes (Action-based POST endpoints)
    ↓
Service Layer (Prisma Service)
    ↓
Database Layer (MongoDB via Prisma)
```

## File Structure Template

```
src/
├── prisma/
│   ├── prisma.ts                    # Prisma client configuration
│   └── [Entity]Service.ts           # Database service layer
├── model/
│   ├── [entity].ts                  # TypeScript interfaces
│   ├── service/
│   │   └── use[Entity].ts           # React hooks
│   └── validation/
│       └── [entity].ts              # Zod schemas
├── app/api/[entity]/
│   ├── list/route.ts                # POST /api/[entity]/list
│   ├── get/route.ts                 # POST /api/[entity]/get
│   ├── create/route.ts              # POST /api/[entity]/create
│   ├── update/route.ts              # POST /api/[entity]/update
│   └── delete/route.ts              # POST /api/[entity]/delete
└── components/pages/[entity]/
    ├── [Entity]ListPage.tsx
    ├── [Entity]DetailPage.tsx
    ├── [Entity]Form.tsx
    └── [Entity]Card.tsx

prisma/
└── schema.prisma                    # Database schema

scripts/
└── seed-[entity].ts                 # Database seeding script

.env.example                         # Environment variables template
```

## 1. Database Schema (Prisma)

### Template: `prisma/schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model [Entity] {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  // Add your specific fields here
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("[entities]")
}

// Add related models as needed
model [RelatedEntity] {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  // Add fields
  [entity]Id  String    @db.ObjectId
  [entity]    [Entity]  @relation(fields: [[entity]Id], references: [id], onDelete: Cascade)

  @@map("[related_entities]")
}
```

## 2. Environment Configuration

### Template: `.env.example`

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 3. Prisma Client Configuration

### Template: `src/prisma/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## 4. TypeScript Interfaces

### Template: `src/model/[entity].ts`

```typescript
export interface [Entity] {
  id: string;
  name: string;
  // Add your specific fields
}

export interface [Entity]FormData {
  name: string;
  // Add your specific fields
}

export interface [Entity]Filters {
  searchTerm: string;
  // Add filter options
}

// Add related interfaces as needed
export interface [RelatedEntity] {
  id: string;
  // Add fields
}
```

## 5. Zod Validation Schemas

### Template: `src/model/validation/[entity].ts`

```typescript
import { z } from 'zod';

export const [entity]Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  // Add validation for your fields
});

export type [Entity]FormData = z.infer<typeof [entity]Schema>;
```

## 6. Database Service Layer

### Template: `src/prisma/[Entity]Service.ts`

```typescript
import { [Entity], [Entity]FormData } from '@/model/[entity]';
import { prisma } from '@/prisma/prisma';

export class [Entity]Service {
  static async getAll[Entities](filters?: {
    search?: string;
    // Add your filter types
  }): Promise<[Entity][]> {
    try {
      const where: any = {};

      if (filters?.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      // Add other filters

      const [entities] = await prisma.[entity].findMany({
        where,
        include: {
          // Add relations
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return [entities].map(([entity]: any) => ({
        id: [entity].id,
        name: [entity].name,
        // Map other fields
      }));
    } catch (error) {
      console.error('Error fetching [entities]:', error);
      throw new Error('Failed to fetch [entities]');
    }
  }

  static async get[Entity]ById(id: string): Promise<[Entity] | null> {
    try {
      const [entity] = await prisma.[entity].findUnique({
        where: { id },
        include: {
          // Add relations
        }
      });

      if (![entity]) return null;

      return {
        id: [entity].id,
        name: [entity].name,
        // Map other fields
      };
    } catch (error) {
      console.error('Error fetching [entity]:', error);
      throw new Error('Failed to fetch [entity]');
    }
  }

  static async create[Entity](data: [Entity]FormData): Promise<[Entity]> {
    try {
      const [entity] = await prisma.[entity].create({
        data: {
          name: data.name,
          // Add other fields
        },
        include: {
          // Add relations
        }
      });

      return {
        id: [entity].id,
        name: [entity].name,
        // Map other fields
      };
    } catch (error) {
      console.error('Error creating [entity]:', error);
      throw new Error('Failed to create [entity]');
    }
  }

  static async update[Entity](id: string, data: [Entity]FormData): Promise<[Entity] | null> {
    try {
      const [entity] = await prisma.[entity].update({
        where: { id },
        data: {
          name: data.name,
          // Add other fields
        },
        include: {
          // Add relations
        }
      });

      return {
        id: [entity].id,
        name: [entity].name,
        // Map other fields
      };
    } catch (error) {
      console.error('Error updating [entity]:', error);
      throw new Error('Failed to update [entity]');
    }
  }

  static async delete[Entity](id: string): Promise<boolean> {
    try {
      await prisma.[entity].delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting [entity]:', error);
      throw new Error('Failed to delete [entity]');
    }
  }
}
```

## 7. React Hooks

### Template: `src/model/service/use[Entity].ts`

```typescript
'use client';

import { useState, useCallback, useEffect } from 'react';
import { [Entity], [Entity]FormData } from '@/model/[entity]';

export const use[Entity] = (id?: string) => {
  const [[entity], set[Entity]] = useState<[Entity] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch[Entity] = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/[entity]/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch [entity]');
      }
      
      set[Entity](result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const update[Entity] = useCallback(async (data: [Entity]FormData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/[entity]/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update [entity]');
      }
      
      set[Entity](result.data);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const delete[Entity] = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/[entity]/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete [entity]');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch[Entity]();
  }, [fetch[Entity]]);

  return { 
    [entity], 
    loading, 
    error, 
    update[Entity], 
    delete[Entity],
    refetch: fetch[Entity] 
  };
};

export const use[Entities] = () => {
  const [[entities], set[Entities]] = useState<[Entity][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch[Entities] = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/[entity]/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters || {}),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch [entities]');
      }
      
      set[Entities](result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const create[Entity] = useCallback(async (data: [Entity]FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/[entity]/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create [entity]');
      }
      
      set[Entities](prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch[Entities]();
  }, [fetch[Entities]]);

  return { 
    [entities], 
    loading, 
    error, 
    fetch[Entities], 
    create[Entity] 
  };
};
```

## 8. API Routes

### Template: `src/app/api/[entity]/list/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { [Entity]Service } from '@/prisma/[Entity]Service';

interface ListRequest {
  search?: string;
  // Add other filter types
}

export async function POST(request: NextRequest) {
  try {
    const body: ListRequest = await request.json();
    
    const [entities] = await [Entity]Service.getAll[Entities]({
      search: body.search,
      // Add other filters
    });
    
    return NextResponse.json({
      success: true,
      data: [entities],
      message: `Found ${[entities].length} [entities]`
    });
  } catch (error) {
    console.error('Error listing [entities]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch [entities]',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### Template: `src/app/api/[entity]/get/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { [Entity]Service } from '@/prisma/[Entity]Service';

interface GetRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GetRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide a valid [entity] ID'
        },
        { status: 400 }
      );
    }
    
    const [entity] = await [Entity]Service.get[Entity]ById(body.id);
    
    if (![entity]) {
      return NextResponse.json(
        {
          success: false,
          error: '[Entity] not found',
          message: 'No [entity] found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: [entity],
      message: '[Entity] retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting [entity]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch [entity]',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### Template: `src/app/api/[entity]/create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { [entity]Schema } from '@/model/validation/[entity]';
import { [Entity]Service } from '@/prisma/[Entity]Service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = [entity]Schema.parse(body);

    const new[Entity] = await [Entity]Service.create[Entity](validatedData);
    
    return NextResponse.json({
      success: true,
      data: new[Entity],
      message: '[Entity] created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating [entity]:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create [entity]',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### Template: `src/app/api/[entity]/update/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { [entity]Schema } from '@/model/validation/[entity]';
import { [Entity]Service } from '@/prisma/[Entity]Service';

interface UpdateRequest {
  id: string;
  // Add other fields
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide a valid [entity] ID'
        },
        { status: 400 }
      );
    }
    
    // Validate the request body (excluding id for validation)
    const { id, ...dataToValidate } = body;
    const validatedData = [entity]Schema.parse(dataToValidate);

    const updated[Entity] = await [Entity]Service.update[Entity](id, validatedData);

    if (!updated[Entity]) {
      return NextResponse.json(
        {
          success: false,
          error: '[Entity] not found',
          message: 'No [entity] found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated[Entity],
      message: '[Entity] updated successfully'
    });
  } catch (error) {
    console.error('Error updating [entity]:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update [entity]',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### Template: `src/app/api/[entity]/delete/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { [Entity]Service } from '@/prisma/[Entity]Service';

interface DeleteRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DeleteRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide a valid [entity] ID'
        },
        { status: 400 }
      );
    }
    
    const success = await [Entity]Service.delete[Entity](body.id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '[Entity] not found',
          message: 'No [entity] found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { deleted: true },
      message: '[Entity] deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting [entity]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete [entity]',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

## 9. Database Seeding Script

### Template: `scripts/seed-[entity].ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed[Entities]() {
  try {
    // Clear existing data
    await prisma.[relatedEntity].deleteMany();
    await prisma.[entity].deleteMany();

    // Create [entities] with related data
    const [entities] = [
      {
        name: 'Example [Entity] 1',
        // Add your specific fields
      },
      {
        name: 'Example [Entity] 2',
        // Add your specific fields
      },
    ];

    for (const [entity]Data of [entities]) {
      await prisma.[entity].create({
        data: [entity]Data,
      });
    }

    console.log(`✅ Seeded ${[entities].length} [entities]`);
  } catch (error) {
    console.error('❌ Error seeding [entities]:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed[Entities]()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 10. Setup Instructions

### Step 1: Environment Setup
1. Copy `.env.example` to `.env.local`
2. Update `DATABASE_URL` with your MongoDB connection string
3. Install dependencies: `yarn add prisma @prisma/client zod`

### Step 2: Database Setup
1. Generate Prisma client: `npx prisma generate`
2. Push schema to database: `npx prisma db push`
3. Seed database: `npx tsx scripts/seed-[entity].ts`

### Step 3: Development
1. Start development server: `yarn dev`
2. Test API endpoints:
   - `POST /api/[entity]/list`
   - `POST /api/[entity]/get`
   - `POST /api/[entity]/create`
   - `POST /api/[entity]/update`
   - `POST /api/[entity]/delete`

## 11. Customization Guide

### To adapt this template for a new entity:

1. **Replace placeholders**:
   - `[Entity]` → Your entity name (PascalCase)
   - `[entity]` → Your entity name (camelCase)
   - `[entities]` → Your entity name (plural, camelCase)

2. **Update schema**:
   - Modify `prisma/schema.prisma` with your fields
   - Add relations as needed

3. **Update types**:
   - Modify `src/model/[entity].ts` with your interfaces
   - Update validation schemas

4. **Update service**:
   - Modify `src/prisma/[Entity]Service.ts` with your business logic
   - Add custom filters and queries

5. **Update API routes**:
   - Modify request/response interfaces
   - Add custom validation

6. **Update hooks**:
   - Modify `src/model/service/use[Entity].ts` with your specific needs

## 12. Benefits of This Architecture

1. **Consistent API**: All endpoints follow the same pattern
2. **Type Safety**: Full TypeScript support throughout
3. **Validation**: Zod schemas for request validation
4. **Error Handling**: Consistent error responses
5. **Reusable**: Easy to copy and adapt for new entities
6. **Scalable**: Clean separation of concerns
7. **Maintainable**: Clear file organization

## 13. API Response Format

All endpoints return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 14. Common Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Reset database
npx prisma db push --force-reset

# Seed database
npx tsx scripts/seed-[entity].ts

# View database in Prisma Studio
npx prisma studio
```

This template provides a complete, production-ready foundation for any MongoDB + Prisma + API project with action-based endpoints.
