# Prisma Migration Guide

## ⚠️ Important: MongoDB Limitation

**You are using MongoDB**, which means:
- **Prisma Migrate is NOT supported** for MongoDB
- MongoDB doesn't have a schema, so migrations work differently
- You must use `prisma db push` for MongoDB
- **Data loss can occur** if you're not careful

## Difference between `db push` and `migrate`

### `prisma db push` (MongoDB - Only Option)
- **Use case**: MongoDB databases (your case)
- **Behavior**: Directly syncs schema to database
- **Risk**: Can drop fields/collections and lose data
- **No history**: Doesn't create migration files
- **Required for MongoDB**: This is the only option

### `prisma migrate` (SQL Databases Only)
- **Use case**: PostgreSQL, MySQL, SQLite, etc.
- **Behavior**: Creates migration files that can be reviewed
- **Safe**: Preserves data when possible
- **History**: All changes are tracked in migration files
- **NOT available for MongoDB**

## MongoDB Workflow (Your Current Setup)

### 1. Make changes to `prisma/schema.prisma`

### 2. Review changes carefully
Since MongoDB doesn't support migrations, you need to be extra careful:
- **Backup your database** before making changes
- Review what fields/collections will be affected
- Plan data migration scripts if needed

### 3. Push schema changes
```bash
yarn db:push
# or
npx prisma db push
```

This will:
- Apply schema changes to your MongoDB database
- **May drop fields** if you remove them from schema
- Regenerate Prisma Client

### 4. Handle data migration manually
If you need to preserve data when changing fields:

**Example: Renaming a field**
```typescript
// Create a migration script: scripts/migrate-rename-field.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function migrate() {
  // Update all documents
  await prisma.collection.updateMany({
    where: { oldField: { not: null } },
    data: { newField: { $rename: 'oldField' } }
  })
}
```

## Commands

### Development
```bash
# Push schema changes (MongoDB)
yarn db:push

# Generate Prisma Client
yarn db:generate

# Reset database (⚠️ Deletes all data)
yarn db:reset
```

## MongoDB Best Practices

1. **Always backup database** before `db push`
2. **Test on development database** first
3. **Create manual migration scripts** for complex changes
4. **Document schema changes** in commit messages
5. **Use version control** for schema.prisma
6. **Never remove fields** without checking if data exists

## Example Workflow

```bash
# 1. Backup database (manual or using MongoDB tools)
mongodump --uri="your_connection_string" --out=backup/

# 2. Change schema.prisma
# 3. Review changes
# 4. Push changes
yarn db:push

# 5. If needed, run data migration script
tsx scripts/migrate-data.ts

# 6. Test application
# 7. Commit changes
git add prisma/schema.prisma
git commit -m "Add user role field"
```

## Data Migration Scripts

Create scripts in `scripts/` folder for complex changes:

```typescript
// scripts/migrate-user-role.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function migrateUserRole() {
  // Set default role for existing users
  await prisma.user.updateMany({
    where: { role: null },
    data: { role: '' }
  })
  
  console.log('Migration complete')
}

migrateUserRole()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Switching to SQL Database (Optional)

If you want to use Prisma Migrate, consider switching to:
- **PostgreSQL** (recommended)
- **MySQL**
- **SQLite** (development only)

Then you can use proper migrations with history and rollback support.

## Troubleshooting

### Data loss prevention
```bash
# Always backup before pushing
mongodump --uri=$DATABASE_URL --out=backup/$(date +%Y%m%d)

# Then push
yarn db:push
```

### Restore from backup
```bash
mongorestore --uri=$DATABASE_URL backup/20240101/
```

