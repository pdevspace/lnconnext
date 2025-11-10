# Frontend Service Design Specification

## Overview

This document provides a comprehensive design specification for the frontend service that connects to MongoDB using Prisma ORM through action-based API endpoints. The service will manage a "bitcoiner" collection based on the existing speaker data structure, providing full CRUD operations through a modern Next.js application with action-based API routes (non-RESTful).

## Prerequisites

### Requirement Understanding

- **MANDATORY**: Before implementing any feature, ai must read and understand `ai/requirement-spec.md`
- All design decisions must trace back to the requirements specification
- Implementation should align with the functional and non-functional requirements
- Technical constraints and acceptance criteria must be considered

## Database Architecture

### MongoDB Collection: Bitcoiner

The bitcoiner collection will store speaker/bitcoiner information with the following schema:

```typescript
interface Bitcoiner {
	id: string
	name: string
	socialMedia: SocialMedia[]
}

interface SocialMedia {
	id: string // Unique identifier (e.g., "social-1")
	displayText: string // Display text (e.g., "เพจ BLC Chiang Mai")
	username: string // Username/handle (e.g., "BLC Chiang Mai")
	platform: string // Platform name (e.g., "facebook", "youtube")
	urlLink: string // Full URL link
}
```

### Prisma Schema

```prisma
// prisma/schema.prisma
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

## Action-Based API Design

### API Endpoint Structure

Instead of RESTful routes, we use action-based POST endpoints:

```typescript
// List all bitcoiners
POST /api/bitcoiner/list
Payload: { search?: string; platform?: string; }

// Get single bitcoiner
POST /api/bitcoiner/get
Payload: { id: string }

// Create new bitcoiner
POST /api/bitcoiner/create
Payload: { name: string; socialMedia: SocialMedia[] }

// Update bitcoiner
POST /api/bitcoiner/update
Payload: { id: string; name: string; socialMedia: SocialMedia[] }

// Delete bitcoiner
POST /api/bitcoiner/delete
Payload: { id: string }
```

### API Response Format

All endpoints return a consistent response format:

```typescript
interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
	message?: string
}
```

### Benefits of Action-Based API

1. **Consistent Method**: All operations use POST
2. **Payload-Based**: All parameters in request body
3. **Type Safety**: Better TypeScript support
4. **Caching Friendly**: Easier to implement caching
5. **Versioning**: Easy to add API versions

## Direct Database Service Design

### BitcoinerService Class

The service will provide direct database access methods:

```typescript
class BitcoinerService {
	// Get all bitcoiners with optional filtering
	static async getAllBitcoiners(filters?: {
		search?: string
		platform?: string
	}): Promise<Bitcoiner[]>

	// Get single bitcoiner by ID
	static async getBitcoinerById(id: string): Promise<Bitcoiner | null>

	// Create new bitcoiner
	static async createBitcoiner(data: BitcoinerFormData): Promise<Bitcoiner>

	// Update existing bitcoiner
	static async updateBitcoiner(
		id: string,
		data: BitcoinerFormData
	): Promise<Bitcoiner | null>

	// Delete bitcoiner
	static async deleteBitcoiner(id: string): Promise<boolean>

	// Search bitcoiners by name
	static async searchBitcoiners(query: string): Promise<Bitcoiner[]>

	// Filter by social media platform
	static async filterByPlatform(platform: string): Promise<Bitcoiner[]>
}
```

## Frontend Pages Design

### 1. Bitcoiner List Page (`/bitcoiner`)

**Features**:

- Grid layout of bitcoiner cards
- Search and filter functionality
- Pagination controls
- Create new bitcoiner button
- Responsive design with mobile-first approach

**Layout**:

```tsx
<div className="container mx-auto px-4 py-8">
	<div className="flex justify-between items-center mb-6">
		<h1 className="text-3xl font-bold">Bitcoiners</h1>
		<Button href="/bitcoiner/create">Add New Bitcoiner</Button>
	</div>

	<BitcoinerFilters />

	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{bitcoiners.map((bitcoiner) => (
			<BitcoinerCard key={bitcoiner.id} bitcoiner={bitcoiner} />
		))}
	</div>

	<Pagination />
</div>
```

### 2. Bitcoiner Detail Page (`/bitcoiner/[id]`)

**Features**:

- Full bitcoiner information display
- Social media links
- Edit and delete actions
- Responsive layout

**Layout**:

```tsx
<div className="container mx-auto px-4 py-8">
	<div className="max-w-4xl mx-auto">
		<div className="flex justify-between items-start mb-6">
			<div>
				<h1 className="text-3xl font-bold">{bitcoiner.name}</h1>
				{bitcoiner.bio && <p className="text-gray-600 mt-2">{bitcoiner.bio}</p>}
			</div>
			<div className="flex gap-2">
				<Button href={`/bitcoiner/edit/${bitcoiner.id}`}>Edit</Button>
				<Button variant="destructive" onClick={handleDelete}>
					Delete
				</Button>
			</div>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div>
				<h2 className="text-xl font-semibold mb-4">Information</h2>
				{/* Bitcoiner details */}
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-4">Social Media</h2>
				{/* Social media links */}
			</div>
		</div>
	</div>
</div>
```

### 3. Create Bitcoiner Page (`/bitcoiner/create`)

**Features**:

- Form with validation
- Social media management
- Image upload for avatar
- Expertise tags input
- Responsive form layout

**Form Fields**:

- Name (required)
- Bio (optional)
- Avatar (file upload)
- Expertise (multi-select)
- Location (optional)
- Website (optional)
- Social Media (dynamic list)
- Active status (checkbox)

### 4. Edit Bitcoiner Page (`/bitcoiner/edit/[id]`)

**Features**:

- Pre-populated form with existing data
- Same validation as create form
- Update functionality
- Cancel/Delete options

## Component Design

### BitcoinerCard Component

```tsx
interface BitcoinerCardProps {
	bitcoiner: Bitcoiner
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
}

const BitcoinerCard: React.FC<BitcoinerCardProps> = ({
	bitcoiner,
	onEdit,
	onDelete,
}) => {
	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						{bitcoiner.avatar ? (
							<img
								src={bitcoiner.avatar}
								alt={bitcoiner.name}
								className="w-12 h-12 rounded-full object-cover"
							/>
						) : (
							<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
								<User className="w-6 h-6 text-gray-400" />
							</div>
						)}
						<div>
							<h3 className="font-semibold text-lg">{bitcoiner.name}</h3>
							{bitcoiner.location && (
								<p className="text-sm text-gray-500">{bitcoiner.location}</p>
							)}
						</div>
					</div>
					<Badge variant={bitcoiner.isActive ? 'default' : 'secondary'}>
						{bitcoiner.isActive ? 'Active' : 'Inactive'}
					</Badge>
				</div>

				{bitcoiner.bio && (
					<p className="text-gray-600 text-sm mb-4 line-clamp-3">
						{bitcoiner.bio}
					</p>
				)}

				{bitcoiner.expertise.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-4">
						{bitcoiner.expertise.map((skill, index) => (
							<Badge key={index} variant="outline" className="text-xs">
								{skill}
							</Badge>
						))}
					</div>
				)}

				<div className="flex items-center justify-between">
					<div className="flex space-x-2">
						{bitcoiner.socialMedia.slice(0, 3).map((social, index) => (
							<a
								key={social.id || index}
								href={social.urlLink}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-600"
								title={social.displayText}
							>
								<SocialIcon platform={social.platform} />
							</a>
						))}
					</div>
					<div className="flex space-x-1">
						<Button
							size="sm"
							variant="outline"
							onClick={() => onEdit?.(bitcoiner.id)}
						>
							Edit
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={() => onDelete?.(bitcoiner.id)}
						>
							Delete
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
```

### BitcoinerForm Component

```tsx
interface BitcoinerFormProps {
	bitcoiner?: Bitcoiner
	onSubmit: (data: BitcoinerFormData) => void
	onCancel: () => void
	isLoading?: boolean
}

const BitcoinerForm: React.FC<BitcoinerFormProps> = ({
	bitcoiner,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const [formData, setFormData] = useState<BitcoinerFormData>({
		name: bitcoiner?.name || '',
		bio: bitcoiner?.bio || '',
		avatar: bitcoiner?.avatar || '',
		expertise: bitcoiner?.expertise || [],
		location: bitcoiner?.location || '',
		website: bitcoiner?.website || '',
		socialMedia: bitcoiner?.socialMedia || [],
		isActive: bitcoiner?.isActive ?? true,
	})

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<Label htmlFor="name">Name *</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
					/>
				</div>

				<div>
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						value={formData.location}
						onChange={(e) =>
							setFormData({ ...formData, location: e.target.value })
						}
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="bio">Biography</Label>
				<Textarea
					id="bio"
					value={formData.bio}
					onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
					rows={4}
				/>
			</div>

			<div>
				<Label htmlFor="expertise">Expertise</Label>
				<Select
					value={formData.expertise}
					onChange={(value) => setFormData({ ...formData, expertise: value })}
					isMulti
					options={EXPERTISE_OPTIONS}
				/>
			</div>

			<div>
				<Label>Social Media</Label>
				<div className="space-y-4">
					{formData.socialMedia.map((social, index) => (
						<div
							key={social.id || index}
							className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
						>
							<div>
								<Label htmlFor={`social-platform-${index}`}>Platform</Label>
								<Select
									value={social.platform}
									onChange={(value) =>
										updateSocialMedia(index, 'platform', value)
									}
									options={[
										{ value: 'facebook', label: 'Facebook' },
										{ value: 'youtube', label: 'YouTube' },
										{ value: 'twitter', label: 'Twitter' },
										{ value: 'linkedin', label: 'LinkedIn' },
										{ value: 'instagram', label: 'Instagram' },
									]}
								/>
							</div>
							<div>
								<Label htmlFor={`social-displayText-${index}`}>
									Display Text
								</Label>
								<Input
									id={`social-displayText-${index}`}
									value={social.displayText}
									onChange={(e) =>
										updateSocialMedia(index, 'displayText', e.target.value)
									}
									placeholder="e.g., เพจ BLC Chiang Mai"
								/>
							</div>
							<div>
								<Label htmlFor={`social-username-${index}`}>Username</Label>
								<Input
									id={`social-username-${index}`}
									value={social.username}
									onChange={(e) =>
										updateSocialMedia(index, 'username', e.target.value)
									}
									placeholder="e.g., BLC Chiang Mai"
								/>
							</div>
							<div className="flex items-end space-x-2">
								<div className="flex-1">
									<Label htmlFor={`social-urlLink-${index}`}>URL</Label>
									<Input
										id={`social-urlLink-${index}`}
										value={social.urlLink}
										onChange={(e) =>
											updateSocialMedia(index, 'urlLink', e.target.value)
										}
										placeholder="https://..."
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => removeSocialMedia(index)}
								>
									Remove
								</Button>
							</div>
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						onClick={addSocialMedia}
						className="w-full"
					>
						Add Social Media
					</Button>
				</div>
			</div>

			<div className="flex justify-end space-x-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Saving...' : bitcoiner ? 'Update' : 'Create'}
				</Button>
			</div>
		</form>
	)
}
```

## Data Validation

## State Management

### Custom Hooks

```typescript
// hooks/useBitcoiner.ts
export const useBitcoiner = (id?: string) => {
	const [bitcoiner, setBitcoiner] = useState<Bitcoiner | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchBitcoiner = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await fetch(`/api/bitcoiner/${id}`)
			if (!response.ok) throw new Error('Failed to fetch bitcoiner')

			const data = await response.json()
			setBitcoiner(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [id])

	const updateBitcoiner = useCallback(
		async (data: BitcoinerFormData) => {
			if (!id) return

			setLoading(true)
			setError(null)

			try {
				const response = await fetch(`/api/bitcoiner/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})

				if (!response.ok) throw new Error('Failed to update bitcoiner')

				const updated = await response.json()
				setBitcoiner(updated)
				return updated
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[id]
	)

	useEffect(() => {
		fetchBitcoiner()
	}, [fetchBitcoiner])

	return { bitcoiner, loading, error, updateBitcoiner, refetch: fetchBitcoiner }
}
```

## Error Handling

### Error Boundaries

```tsx
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends React.Component<
	React.PropsWithChildren<{}>,
	ErrorBoundaryState
> {
	constructor(props: React.PropsWithChildren<{}>) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							Something went wrong
						</h2>
						<p className="text-gray-600 mb-4">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<Button onClick={() => this.setState({ hasError: false })}>
							Try again
						</Button>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
```

## Performance Optimization

### Data Fetching Strategy

1. **Server-Side Rendering**: Initial page loads with SSR
2. **Client-Side Caching**: React Query for client-side data management
3. **Optimistic Updates**: Immediate UI updates for better UX
4. **Pagination**: Efficient data loading with pagination
5. **Image Optimization**: Next.js Image component for avatars

### Caching Strategy

```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache'

export const getCachedBitcoiners = unstable_cache(
	async (page: number = 1, limit: number = 10) => {
		// Database query logic
	},
	['bitcoiners'],
	{ revalidate: 300 } // 5 minutes
)
```

## Security Considerations

### Input Validation

1. **Client-Side**: form validation
2. **Server-Side**: API route validation
3. **Database**: Prisma type safety
4. **File Uploads**: Secure file handling for avatars

### Authentication & Authorization

1. **API Protection**: Middleware for protected routes
2. **Role-Based Access**: Different permissions for different users
3. **CSRF Protection**: CSRF tokens for form submissions
4. **Rate Limiting**: API rate limiting to prevent abuse

## Testing Strategy

### Unit Tests

1. **Component Tests**: React Testing Library for UI components
2. **Hook Tests**: Custom hook testing
3. **Utility Tests**: Pure function testing
4. **Validation Tests**: schema testing

### Integration Tests

1. **API Tests**: API route testing
2. **Database Tests**: Prisma integration testing
3. **E2E Tests**: Full user flow testing

### Test Structure

```
__tests__/
├── components/
│   └── bitcoiner/
│       ├── BitcoinerCard.test.tsx
│       ├── BitcoinerForm.test.tsx
│       └── BitcoinerListPage.test.tsx
├── api/
│   └── bitcoiner/
│       ├── route.test.ts
│       └── [id]/
│           └── route.test.ts
├── hooks/
│   └── useBitcoiner.test.ts
└── utils/
    └── validations.test.ts
```

## Deployment Configuration

### Environment Variables

```env
# Database
DATABASE_URL="mongodb://localhost:27017/lnconnext"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="5242880" # 5MB
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Migration Strategy

### Data Migration from speakers.json

1. **Migration Script**: Node.js script to migrate existing data
2. **Data Validation**: Ensure data integrity during migration
3. **Backup Strategy**: Backup existing data before migration
4. **Rollback Plan**: Ability to rollback if issues occur

### Migration Script

```typescript
// scripts/migrate-speakers.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateSpeakers() {
	const speakersData = require('../src/data/event/speakers.json')

	for (const speaker of speakersData.speakers) {
		await prisma.bitcoiner.create({
			data: {
				id: speaker.id.replace('speaker-', 'bitcoiner-'),
				name: speaker.name,
				socialMedia: {
					create: speaker.socialMedia.map((sm) => ({
						displayText: sm.displayText || `${sm.platform} ${sm.username}`,
						username: sm.username || '',
						platform: sm.platform || 'unknown',
						urlLink: sm.urlLink || '',
					})),
				},
				isActive: true,
			},
		})
	}

	console.log('Migration completed successfully')
}

migrateSpeakers()
	.catch(console.error)
	.finally(() => prisma.$disconnect())
```

## Future Enhancements

### Advanced Features

1. **Search & Filtering**: Advanced search with multiple criteria
2. **Bulk Operations**: Bulk edit/delete functionality
3. **Export/Import**: CSV/JSON export and import
4. **Audit Logging**: Track all changes to bitcoiner records
5. **Real-time Updates**: WebSocket integration for real-time updates

### Integration Features

1. **Event Integration**: Link bitcoiners to events
2. **Social Media Sync**: Automatic social media data fetching
3. **Analytics**: Usage analytics and reporting
4. **Notifications**: Email notifications for changes

## Conclusion

This frontend service design provides a comprehensive solution for managing bitcoiner data with:

- ✅ **Modern Architecture**: Next.js 14 with App Router
- ✅ **Database Integration**: MongoDB with Prisma ORM
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **CRUD Operations**: Complete create, read, update, delete functionality
- ✅ **Validation**: Client and server-side validation
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Performance**: Optimized data fetching and caching
- ✅ **Security**: Input validation and protection
- ✅ **Testing**: Complete testing strategy
- ✅ **Migration**: Data migration from existing speakers.json

The design ensures scalability, maintainability, and user experience while following modern web development best practices.
