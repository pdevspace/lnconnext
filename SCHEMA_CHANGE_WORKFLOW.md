# Schema Change Workflow for MongoDB

## ⚠️ Important: No Migrations for MongoDB

**MongoDB does NOT support Prisma Migrate**. There are no migration files like SQL databases.

Instead, you use `prisma db push` which directly syncs your schema to the database.

## Workflow: Changing Schema

### Step 1: Backup Database (IMPORTANT!)

Before making any schema changes, always backup your database:

```bash
yarn db:backup
```

This creates a backup in `backup/YYYYMMDD_HHMMSS/` folder.

**Why?** If something goes wrong, you can restore from backup.

### Step 2: Make Changes to Schema

Edit `prisma/schema.prisma`:

```prisma
model User {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  uid String @unique
  email String
  role String  // ← Adding new field
  // ... other fields
}
```

### Step 3: Review Changes

Check what will change:

- New fields will be added
- Removed fields will be **deleted from database** (data loss!)
- Changed field types may cause issues

### Step 4: Push Schema Changes

```bash
yarn db:push
```

This will:

- ✅ Add new fields to existing documents
- ✅ Create new collections if needed
- ⚠️ **Remove fields** if you deleted them from schema (data loss!)
- ✅ Regenerate Prisma Client

### Step 5: Handle Data Migration (if needed)

If you:

- **Renamed a field**: Create a migration script
- **Changed field type**: Create a migration script
- **Removed a field**: Data is lost (unless you restore from backup)

**Example: Renaming a field**

```typescript
// scripts/migrate-rename-field.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrate() {
	// MongoDB doesn't support rename directly, so we copy and delete
	const users = await prisma.user.findMany()

	for (const user of users) {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				newFieldName: (user as any).oldFieldName, // Copy old value
				// oldFieldName will be removed by next db:push
			},
		})
	}

	console.log('Migration complete')
}

migrate()
	.catch(console.error)
	.finally(() => prisma.$disconnect())
```

### Step 6: Test Application

Make sure everything works:

- Test API endpoints
- Check data integrity
- Verify new fields work correctly

### Step 7: Commit Changes

```bash
git add prisma/schema.prisma
git commit -m "Add role field to User model"
```

## Complete Example Workflow

```bash
# 1. Backup (ALWAYS FIRST!)
yarn db:backup
# Output: ✅ Backup completed successfully: backup/20240115_143022

# 2. Edit prisma/schema.prisma
# Add: role String

# 3. Push changes
yarn db:push
# Output: ✅ Database synchronized

# 4. If needed, migrate existing data
# (Only if you renamed fields or need to transform data)
tsx scripts/migrate-user-role.ts

# 5. Test
yarn dev
# Test your API endpoints

# 6. Commit
git add prisma/schema.prisma
git commit -m "Add role field to User model"
```

## Restoring from Backup

If something goes wrong:

```bash
# Restore from backup
mongorestore --uri=$DATABASE_URL backup/20240115_143022
```

Or use the restore command from the backup output.

## Common Scenarios

### Adding a New Field

✅ **Safe** - Existing documents get the new field (null/empty)

```prisma
model User {
  role String  // New field
}
```

```bash
yarn db:backup  # Optional but recommended
yarn db:push
```

### Removing a Field

⚠️ **Data Loss** - Field and data will be deleted!

```prisma
model User {
  // oldField String  // Removed
}
```

```bash
yarn db:backup  # REQUIRED!
yarn db:push    # Data will be lost
```

### Renaming a Field

⚠️ **Requires Migration Script**

```prisma
model User {
  newName String  // Was: oldName
}
```

```bash
yarn db:backup
# 1. Create migration script to copy data
tsx scripts/migrate-rename-field.ts
# 2. Update schema
yarn db:push
```

### Changing Field Type

⚠️ **May Cause Issues**

```prisma
model User {
  count Int  // Was: String
}
```

```bash
yarn db:backup  # REQUIRED!
# Create migration script to convert data
tsx scripts/migrate-convert-type.ts
yarn db:push
```

## Best Practices

1. ✅ **Always backup before `db:push`**
2. ✅ **Test on development database first**
3. ✅ **Review schema changes carefully**
4. ✅ **Create migration scripts for complex changes**
5. ✅ **Commit schema.prisma to version control**
6. ❌ **Never remove fields without backup**
7. ❌ **Never push to production without testing**

## Quick Reference

```bash
# Backup database
yarn db:backup

# Push schema changes
yarn db:push

# Generate Prisma Client (auto-run by db:push)
yarn db:generate

# Reset database (⚠️ deletes all data)
yarn db:reset
```

## Summary

**MongoDB = No Migrations**

- No migration files
- Use `prisma db push` directly
- Always backup first
- Create manual scripts for complex changes
- Restore from backup if needed
