# Quick Setup Script for MongoDB + Prisma + API Projects

## Overview

This script automates the setup of a new MongoDB + Prisma + API project using the template structure.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Yarn package manager

## Setup Script

### `setup-project.sh`

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if entity name is provided
if [ -z "$1" ]; then
    print_error "Please provide an entity name (e.g., 'user', 'product', 'order')"
    echo "Usage: ./setup-project.sh <entity-name>"
    exit 1
fi

ENTITY_NAME=$1
ENTITY_PASCAL=$(echo $ENTITY_NAME | sed 's/^./\U&/')
ENTITY_PLURAL="${ENTITY_NAME}s"

print_status "Setting up project for entity: $ENTITY_NAME"
print_status "Pascal case: $ENTITY_PASCAL"
print_status "Plural: $ENTITY_PLURAL"

# Create directory structure
print_status "Creating directory structure..."

mkdir -p src/prisma
mkdir -p src/model/service
mkdir -p src/model/validation
mkdir -p src/app/api/$ENTITY_NAME/list
mkdir -p src/app/api/$ENTITY_NAME/get
mkdir -p src/app/api/$ENTITY_NAME/create
mkdir -p src/app/api/$ENTITY_NAME/update
mkdir -p src/app/api/$ENTITY_NAME/delete
mkdir -p src/components/pages/$ENTITY_NAME
mkdir -p scripts
mkdir -p prisma

print_success "Directory structure created"

# Create .env.example
print_status "Creating .env.example..."
cat > .env.example << EOF
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
EOF

# Create Prisma schema
print_status "Creating Prisma schema..."
cat > prisma/schema.prisma << EOF
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model $ENTITY_PASCAL {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  // Add your specific fields here
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("$ENTITY_PLURAL")
}
EOF

# Create Prisma client
print_status "Creating Prisma client..."
cat > src/prisma/prisma.ts << EOF
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
EOF

# Create entity types
print_status "Creating entity types..."
cat > src/model/$ENTITY_NAME.ts << EOF
export interface $ENTITY_PASCAL {
  id: string;
  name: string;
  // Add your specific fields here
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ${ENTITY_PASCAL}FormData {
  name: string;
  // Add your specific fields here
}

export interface ${ENTITY_PASCAL}Filters {
  searchTerm: string;
  // Add filter options here
}
EOF

# Create validation schema
print_status "Creating validation schema..."
cat > src/model/validation/$ENTITY_NAME.ts << EOF
import { z } from 'zod';

export const ${ENTITY_NAME}Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  // Add validation for your fields here
});

export type ${ENTITY_PASCAL}FormData = z.infer<typeof ${ENTITY_NAME}Schema>;
EOF

# Create service class
print_status "Creating service class..."
cat > src/prisma/${ENTITY_PASCAL}Service.ts << EOF
import { $ENTITY_PASCAL, ${ENTITY_PASCAL}FormData } from '@/model/$ENTITY_NAME';
import { prisma } from '@/prisma/prisma';

export class ${ENTITY_PASCAL}Service {
  static async getAll${ENTITY_PASCAL}s(filters?: {
    search?: string;
    // Add your filter types here
  }): Promise<$ENTITY_PASCAL[]> {
    try {
      const where: any = {};

      if (filters?.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive'
        };
      }

      // Add other filters here

      const $ENTITY_PLURAL = await prisma.$ENTITY_NAME.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return $ENTITY_PLURAL.map(($ENTITY_NAME: any) => ({
        id: $ENTITY_NAME.id,
        name: $ENTITY_NAME.name,
        // Map other fields here
        createdAt: $ENTITY_NAME.createdAt,
        updatedAt: $ENTITY_NAME.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching $ENTITY_PLURAL:', error);
      throw new Error('Failed to fetch $ENTITY_PLURAL');
    }
  }

  static async get${ENTITY_PASCAL}ById(id: string): Promise<$ENTITY_PASCAL | null> {
    try {
      const $ENTITY_NAME = await prisma.$ENTITY_NAME.findUnique({
        where: { id }
      });

      if (!$ENTITY_NAME) return null;

      return {
        id: $ENTITY_NAME.id,
        name: $ENTITY_NAME.name,
        // Map other fields here
        createdAt: $ENTITY_NAME.createdAt,
        updatedAt: $ENTITY_NAME.updatedAt
      };
    } catch (error) {
      console.error('Error fetching $ENTITY_NAME:', error);
      throw new Error('Failed to fetch $ENTITY_NAME');
    }
  }

  static async create${ENTITY_PASCAL}(data: ${ENTITY_PASCAL}FormData): Promise<$ENTITY_PASCAL> {
    try {
      const $ENTITY_NAME = await prisma.$ENTITY_NAME.create({
        data: {
          name: data.name,
          // Add other fields here
        }
      });

      return {
        id: $ENTITY_NAME.id,
        name: $ENTITY_NAME.name,
        // Map other fields here
        createdAt: $ENTITY_NAME.createdAt,
        updatedAt: $ENTITY_NAME.updatedAt
      };
    } catch (error) {
      console.error('Error creating $ENTITY_NAME:', error);
      throw new Error('Failed to create $ENTITY_NAME');
    }
  }

  static async update${ENTITY_PASCAL}(id: string, data: ${ENTITY_PASCAL}FormData): Promise<$ENTITY_PASCAL | null> {
    try {
      const $ENTITY_NAME = await prisma.$ENTITY_NAME.update({
        where: { id },
        data: {
          name: data.name,
          // Add other fields here
        }
      });

      return {
        id: $ENTITY_NAME.id,
        name: $ENTITY_NAME.name,
        // Map other fields here
        createdAt: $ENTITY_NAME.createdAt,
        updatedAt: $ENTITY_NAME.updatedAt
      };
    } catch (error) {
      console.error('Error updating $ENTITY_NAME:', error);
      throw new Error('Failed to update $ENTITY_NAME');
    }
  }

  static async delete${ENTITY_PASCAL}(id: string): Promise<boolean> {
    try {
      await prisma.$ENTITY_NAME.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting $ENTITY_NAME:', error);
      throw new Error('Failed to delete $ENTITY_NAME');
    }
  }
}
EOF

# Create React hooks
print_status "Creating React hooks..."
cat > src/model/service/use${ENTITY_PASCAL}.ts << EOF
'use client';

import { useState, useCallback, useEffect } from 'react';
import { $ENTITY_PASCAL, ${ENTITY_PASCAL}FormData } from '@/model/$ENTITY_NAME';

export const use${ENTITY_PASCAL} = (id?: string) => {
  const [$ENTITY_NAME, set${ENTITY_PASCAL}] = useState<$ENTITY_PASCAL | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch${ENTITY_PASCAL} = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/$ENTITY_NAME/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch $ENTITY_NAME');
      }
      
      set${ENTITY_PASCAL}(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const update${ENTITY_PASCAL} = useCallback(async (data: ${ENTITY_PASCAL}FormData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/$ENTITY_NAME/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update $ENTITY_NAME');
      }
      
      set${ENTITY_PASCAL}(result.data);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const delete${ENTITY_PASCAL} = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/$ENTITY_NAME/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete $ENTITY_NAME');
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
    fetch${ENTITY_PASCAL}();
  }, [fetch${ENTITY_PASCAL}]);

  return { 
    $ENTITY_NAME, 
    loading, 
    error, 
    update${ENTITY_PASCAL}, 
    delete${ENTITY_PASCAL},
    refetch: fetch${ENTITY_PASCAL} 
  };
};

export const use${ENTITY_PASCAL}s = () => {
  const [$ENTITY_PLURAL, set${ENTITY_PASCAL}s] = useState<$ENTITY_PASCAL[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch${ENTITY_PASCAL}s = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/$ENTITY_NAME/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters || {}),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch $ENTITY_PLURAL');
      }
      
      set${ENTITY_PASCAL}s(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const create${ENTITY_PASCAL} = useCallback(async (data: ${ENTITY_PASCAL}FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/$ENTITY_NAME/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create $ENTITY_NAME');
      }
      
      set${ENTITY_PASCAL}s(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch${ENTITY_PASCAL}s();
  }, [fetch${ENTITY_PASCAL}s]);

  return { 
    $ENTITY_PLURAL, 
    loading, 
    error, 
    fetch${ENTITY_PASCAL}s, 
    create${ENTITY_PASCAL} 
  };
};
EOF

# Create API routes
print_status "Creating API routes..."

# List route
cat > src/app/api/$ENTITY_NAME/list/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { ${ENTITY_PASCAL}Service } from '@/prisma/${ENTITY_PASCAL}Service';

interface ListRequest {
  search?: string;
  // Add other filter types here
}

export async function POST(request: NextRequest) {
  try {
    const body: ListRequest = await request.json();
    
    const $ENTITY_PLURAL = await ${ENTITY_PASCAL}Service.getAll${ENTITY_PASCAL}s({
      search: body.search,
      // Add other filters here
    });
    
    return NextResponse.json({
      success: true,
      data: $ENTITY_PLURAL,
      message: \`Found \${$ENTITY_PLURAL.length} $ENTITY_PLURAL\`
    });
  } catch (error) {
    console.error('Error listing $ENTITY_PLURAL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch $ENTITY_PLURAL',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
EOF

# Get route
cat > src/app/api/$ENTITY_NAME/get/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { ${ENTITY_PASCAL}Service } from '@/prisma/${ENTITY_PASCAL}Service';

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
          message: 'Please provide a valid $ENTITY_NAME ID'
        },
        { status: 400 }
      );
    }
    
    const $ENTITY_NAME = await ${ENTITY_PASCAL}Service.get${ENTITY_PASCAL}ById(body.id);
    
    if (!$ENTITY_NAME) {
      return NextResponse.json(
        {
          success: false,
          error: '${ENTITY_PASCAL} not found',
          message: 'No $ENTITY_NAME found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: $ENTITY_NAME,
      message: '${ENTITY_PASCAL} retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting $ENTITY_NAME:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch $ENTITY_NAME',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
EOF

# Create route
cat > src/app/api/$ENTITY_NAME/create/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { ${ENTITY_NAME}Schema } from '@/model/validation/$ENTITY_NAME';
import { ${ENTITY_PASCAL}Service } from '@/prisma/${ENTITY_PASCAL}Service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = ${ENTITY_NAME}Schema.parse(body);

    const new${ENTITY_PASCAL} = await ${ENTITY_PASCAL}Service.create${ENTITY_PASCAL}(validatedData);
    
    return NextResponse.json({
      success: true,
      data: new${ENTITY_PASCAL},
      message: '${ENTITY_PASCAL} created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating $ENTITY_NAME:', error);
    
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
        error: 'Failed to create $ENTITY_NAME',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
EOF

# Update route
cat > src/app/api/$ENTITY_NAME/update/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { ${ENTITY_NAME}Schema } from '@/model/validation/$ENTITY_NAME';
import { ${ENTITY_PASCAL}Service } from '@/prisma/${ENTITY_PASCAL}Service';

interface UpdateRequest {
  id: string;
  // Add other fields here
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide a valid $ENTITY_NAME ID'
        },
        { status: 400 }
      );
    }
    
    // Validate the request body (excluding id for validation)
    const { id, ...dataToValidate } = body;
    const validatedData = ${ENTITY_NAME}Schema.parse(dataToValidate);

    const updated${ENTITY_PASCAL} = await ${ENTITY_PASCAL}Service.update${ENTITY_PASCAL}(id, validatedData);

    if (!updated${ENTITY_PASCAL}) {
      return NextResponse.json(
        {
          success: false,
          error: '${ENTITY_PASCAL} not found',
          message: 'No $ENTITY_NAME found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated${ENTITY_PASCAL},
      message: '${ENTITY_PASCAL} updated successfully'
    });
  } catch (error) {
    console.error('Error updating $ENTITY_NAME:', error);
    
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
        error: 'Failed to update $ENTITY_NAME',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
EOF

# Delete route
cat > src/app/api/$ENTITY_NAME/delete/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server';
import { ${ENTITY_PASCAL}Service } from '@/prisma/${ENTITY_PASCAL}Service';

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
          message: 'Please provide a valid $ENTITY_NAME ID'
        },
        { status: 400 }
      );
    }
    
    const success = await ${ENTITY_PASCAL}Service.delete${ENTITY_PASCAL}(body.id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '${ENTITY_PASCAL} not found',
          message: 'No $ENTITY_NAME found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { deleted: true },
      message: '${ENTITY_PASCAL} deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting $ENTITY_NAME:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete $ENTITY_NAME',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
EOF

# Create seed script
print_status "Creating seed script..."
cat > scripts/seed-$ENTITY_PLURAL.ts << EOF
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed${ENTITY_PASCAL}s() {
  try {
    // Clear existing data
    await prisma.$ENTITY_NAME.deleteMany();

    // Create $ENTITY_PLURAL
    const $ENTITY_PLURAL = [
      {
        name: 'Example $ENTITY_PASCAL 1',
        // Add your specific fields here
      },
      {
        name: 'Example $ENTITY_PASCAL 2',
        // Add your specific fields here
      },
    ];

    for (const ${ENTITY_NAME}Data of $ENTITY_PLURAL) {
      await prisma.$ENTITY_NAME.create({
        data: ${ENTITY_NAME}Data,
      });
    }

    console.log(\`✅ Seeded \${$ENTITY_PLURAL.length} $ENTITY_PLURAL\`);
  } catch (error) {
    console.error('❌ Error seeding $ENTITY_PLURAL:', error);
    throw error;
  } finally {
    await prisma.\$disconnect();
  }
}

// Run the seed function
seed${ENTITY_PASCAL}s()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOF

# Create package.json scripts
print_status "Adding package.json scripts..."
if [ -f package.json ]; then
    # Add scripts to existing package.json
    npm pkg set scripts."db:generate"="prisma generate"
    npm pkg set scripts."db:push"="prisma db push"
    npm pkg set scripts."db:seed"="tsx scripts/seed-$ENTITY_PLURAL.ts"
    npm pkg set scripts."db:reset"="prisma db push --force-reset && npm run db:seed"
else
    # Create new package.json
    cat > package.json << EOF
{
  "name": "$ENTITY_NAME-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx scripts/seed-$ENTITY_PLURAL.ts",
    "db:reset": "prisma db push --force-reset && npm run db:seed"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
EOF
fi

print_success "Project setup completed!"
print_status "Next steps:"
echo "1. Copy .env.example to .env.local and update DATABASE_URL"
echo "2. Run: npm install"
echo "3. Run: npm run db:generate"
echo "4. Run: npm run db:push"
echo "5. Run: npm run db:seed"
echo "6. Run: npm run dev"
print_warning "Don't forget to customize the schema and types for your specific entity!"
EOF
```

## Usage

```bash
# Make the script executable
chmod +x setup-project.sh

# Run the script with your entity name
./setup-project.sh user
./setup-project.sh product
./setup-project.sh order
```

## What the Script Creates

1. **Complete directory structure** for the entity
2. **Prisma schema** with basic entity model
3. **TypeScript interfaces** for the entity
4. **Zod validation schemas**
5. **Database service class** with CRUD operations
6. **React hooks** for data management
7. **API routes** for all CRUD operations
8. **Seed script** for database population
9. **Package.json** with necessary scripts
10. **Environment configuration** template

## Customization After Setup

After running the script, you'll need to:

1. **Update the Prisma schema** with your specific fields
2. **Update TypeScript interfaces** to match your schema
3. **Update validation schemas** with your field validations
4. **Customize the service class** with your business logic
5. **Update API routes** with your specific requirements
6. **Create React components** for your UI
7. **Update the seed script** with your sample data

This script provides a solid foundation that can be quickly customized for any entity management system.
