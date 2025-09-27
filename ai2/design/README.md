# MongoDB + Prisma + API Design Templates

This directory contains reusable design specifications and templates for creating MongoDB + Prisma + API projects with action-based endpoints.

## 📁 Files Overview

### 1. **`mongodb-prisma-api-template.md`**
Complete template for any entity management system. Contains:
- File structure template
- Database schema template
- TypeScript interfaces template
- Validation schemas template
- Database service layer template
- React hooks template
- API routes template
- Database seeding template
- Setup instructions
- Customization guide

### 2. **`bitcoiner-implementation-guide.md`**
Specific implementation example using the bitcoiner project. Contains:
- Complete file structure
- Actual database schema
- Real TypeScript interfaces
- Working validation schemas
- Production-ready service class
- Functional API endpoints
- Database seeding script
- API testing examples

### 3. **`setup-script.md`**
Automated setup script for quick project initialization. Contains:
- Bash script for project generation
- Automatic file creation
- Directory structure setup
- Package.json configuration
- Environment setup
- Usage instructions

## 🚀 Quick Start

### Option 1: Use the Setup Script (Recommended)

```bash
# Make the script executable
chmod +x setup-project.sh

# Create a new project for any entity
./setup-project.sh user
./setup-project.sh product
./setup-project.sh order
```

### Option 2: Manual Setup

1. Copy `mongodb-prisma-api-template.md`
2. Replace all placeholders with your entity name
3. Customize the schema and interfaces
4. Implement your business logic

### Option 3: Copy from Bitcoiner Example

1. Copy `bitcoiner-implementation-guide.md`
2. Replace "bitcoiner" with your entity name
3. Update the schema and interfaces
4. Modify the business logic

## 🏗️ Architecture Pattern

```
Frontend (React/Next.js)
    ↓
API Routes (Action-based POST endpoints)
    ↓
Service Layer (Prisma Service)
    ↓
Database Layer (MongoDB via Prisma)
```

## 📋 API Endpoint Structure

All projects follow this consistent pattern:

```
POST /api/[entity]/list     # List all entities
POST /api/[entity]/get      # Get single entity
POST /api/[entity]/create   # Create new entity
POST /api/[entity]/update   # Update entity
POST /api/[entity]/delete   # Delete entity
```

## 🎯 Benefits

1. **Consistent API**: All endpoints follow the same pattern
2. **Type Safety**: Full TypeScript support throughout
3. **Validation**: Zod schemas for request validation
4. **Error Handling**: Consistent error responses
5. **Reusable**: Easy to copy and adapt for new entities
6. **Scalable**: Clean separation of concerns
7. **Maintainable**: Clear file organization

## 📦 Dependencies

```json
{
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
```

## 🔧 Common Commands

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

## 📝 Customization Guide

### To adapt for a new entity:

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

## 🎨 Example Projects

### Bitcoiner Management System
- **Entity**: Bitcoiner
- **Features**: Social media links, bio, expertise, location
- **Relations**: One-to-many with SocialMedia
- **API**: Full CRUD operations with search and filtering

### User Management System
- **Entity**: User
- **Features**: Profile, roles, permissions
- **Relations**: One-to-many with UserRole
- **API**: Full CRUD operations with role-based access

### Product Catalog System
- **Entity**: Product
- **Features**: Name, description, price, categories
- **Relations**: Many-to-many with Category
- **API**: Full CRUD operations with category filtering

## 🔍 File Structure

```
ai2/design/
├── README.md                           # This file
├── mongodb-prisma-api-template.md      # Complete template
├── bitcoiner-implementation-guide.md   # Bitcoiner example
└── setup-script.md                     # Automated setup
```

## 📚 Usage Examples

### Creating a User Management System

```bash
# Run the setup script
./setup-project.sh user

# Customize the schema
# Edit prisma/schema.prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  role      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

# Update types
# Edit src/model/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

# Update validation
# Edit src/model/validation/user.ts
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string().min(1),
});

# Run setup commands
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### Creating a Product Catalog

```bash
# Run the setup script
./setup-project.sh product

# Customize the schema
# Edit prisma/schema.prisma
model Product {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String
  price       Decimal
  categoryId  String     @db.ObjectId
  category    Category   @relation(fields: [categoryId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("products")
}

model Category {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("categories")
}

# Continue with customization...
```

## 🚨 Important Notes

1. **Environment Variables**: Always copy `.env.example` to `.env.local` and update `DATABASE_URL`
2. **Database Connection**: Ensure MongoDB is accessible and credentials are correct
3. **Schema Changes**: Run `npx prisma generate` after schema changes
4. **Type Safety**: Update TypeScript interfaces when changing the schema
5. **Validation**: Update Zod schemas when adding new fields
6. **Testing**: Test all API endpoints after implementation

## 🤝 Contributing

To improve these templates:

1. Add new features to the template
2. Update the bitcoiner example
3. Enhance the setup script
4. Add more example projects
5. Improve documentation

## 📄 License

These templates are provided as-is for educational and development purposes. Feel free to use and modify as needed for your projects.
