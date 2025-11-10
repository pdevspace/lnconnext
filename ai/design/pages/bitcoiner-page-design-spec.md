# Bitcoiner Page Design Specification

## Overview

This document provides detailed design specifications for all bitcoiner-related pages in the LNConnext platform. The pages follow the established design system with responsive layouts, proper navbar integration, and mobile-first design principles.

## Integration with Main Design System

This specification extends the main design system defined in `ai/design/design-spec.md` and follows the established patterns for:

- **Navbar Integration**: Fixed navbar with proper spacing (`mt-[130px]` or `pt-16`)
- **Layout Patterns**: Consistent container and spacing patterns
- **Component Usage**: Reuse of existing public components
- **Responsive Design**: Mobile-first approach with established breakpoints
- **Dark Mode Support**: Full theme integration
- **Scrollable Content**: Consistent scrollable implementation across all pages

### Scrollable Content Pattern

All bitcoiner pages follow the established scrollable content pattern used throughout the application:

```tsx
{
	/* Main Content - with proper navbar clearance and scrollable content */
}
;<div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
	<div className="container mx-auto px-4">{/* Page content */}</div>
</div>
```

**Key Features:**

- **`h-screen`**: Full viewport height
- **`overflow-y-auto`**: Vertical scrolling when content exceeds viewport
- **`px-0 py-6`**: Consistent padding (no horizontal padding, vertical padding)
- **`mt-[130px]`**: Proper clearance for fixed navbar
- **`w-full`**: Full width for proper scrolling behavior

This pattern ensures consistent scrolling behavior across all pages and proper integration with the fixed navbar.

## Prerequisites

### Requirement Understanding

- **MANDATORY**: Before implementing any feature, ai must read and understand `ai/requirement-spec.md`
- All design decisions must trace back to the requirements specification
- Implementation should align with the functional and non-functional requirements
- Technical constraints and acceptance criteria must be considered

### Design System Integration

- **Consistent Styling**: Follows the established design system from `ai/design/design-spec.md`
- **Component Library**: Uses shadcn/ui components with Radix UI primitives
- **Dark Mode Support**: Full dark/light mode compatibility
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast ratios

## Data Structure

### Bitcoiner Interface

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

## Component Integration

### Reuse of Existing Public Components

The bitcoiner pages leverage existing public components from `src/components/pages/public/`:

- **SocialMediaBox**: Reused for displaying social media links in bitcoiner cards and detail pages
- **SpeakerBox**: Can be adapted for bitcoiner profile display
- **Consistent Styling**: All components follow the established design system

### Custom Bitcoiner Components

New components specific to bitcoiner functionality:

- **BitcoinerCard**: Displays bitcoiner information in list view
- **BitcoinerFilters**: Search and filter functionality
- **BitcoinerForm**: Create and edit forms with social media management
- **SocialMediaCard**: Individual social media link display

## Page Specifications

### 1. Bitcoiner List Page (`/bitcoiner`)

**Route**: `src/app/bitcoiner/page.tsx`
**Component**: `src/components/pages/bitcoiner/BitcoinerListPage.tsx`

#### Layout Structure

```tsx
<div className="min-h-screen bg-background">
	{/* Fixed Header - follows established pattern */}
	<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
		<div className="container mx-auto px-4 py-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Bitcoiners
					</h1>
					<p className="text-muted-foreground">
						Discover and connect with Bitcoin community members
					</p>
				</div>
				<Button href="/bitcoiner/create" className="mt-4 sm:mt-0" size="lg">
					<Plus className="w-4 h-4 mr-2" />
					Add New Bitcoiner
				</Button>
			</div>

			{/* Search and Filter Section */}
			<div className="mt-6">
				<BitcoinerFilters />
			</div>
		</div>
	</div>

	{/* Main Content - with proper navbar clearance and scrollable content */}
	<div className="h-screen overflow-y-auto px-0 py-6 mt-[264px] w-full">
		<div className="container mx-auto px-4">
			{/* Bitcoiners Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{bitcoiners.map((bitcoiner) => (
					<BitcoinerCard key={bitcoiner.id} bitcoiner={bitcoiner} />
				))}
			</div>

			{/* Empty State */}
			{bitcoiners.length === 0 && <EmptyState />}

			{/* Pagination */}
			<Pagination />
		</div>
	</div>
</div>
```

#### Features

- **Grid Layout**: Responsive grid with 1-4 columns based on screen size
- **Search Functionality**: Real-time search by name
- **Filter Options**: Filter by platform, active status
- **Create Button**: Prominent button to add new bitcoiner
- **Empty State**: Friendly message when no bitcoiners found
- **Pagination**: Handle large datasets efficiently

#### Responsive Behavior

- **Mobile (< 768px)**: Single column, full-width cards
- **Tablet (768px - 1024px)**: 2 columns
- **Desktop (1024px - 1280px)**: 3 columns
- **Large Desktop (> 1280px)**: 4 columns

### 2. Bitcoiner Detail Page (`/bitcoiner/[id]`)

**Route**: `src/app/bitcoiner/[id]/page.tsx`
**Component**: `src/components/pages/bitcoiner/BitcoinerDetailPage.tsx`

#### Layout Structure

```tsx
<div className="min-h-screen bg-background">
	{/* Fixed Header - follows established pattern */}
	<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
		<div className="container mx-auto px-4 py-4">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					href="/bitcoiner"
					className="text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Bitcoiners
				</Button>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button href={`/bitcoiner/edit/${bitcoiner.id}`} variant="outline">
						<Edit className="w-4 h-4 mr-2" />
						Edit
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						<Trash2 className="w-4 h-4 mr-2" />
						Delete
					</Button>
				</div>
			</div>
		</div>
	</div>

	{/* Main Content - with proper navbar clearance and scrollable content */}
	<div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
		<div className="container mx-auto px-4">
			<div className="max-w-4xl mx-auto">
				{/* Profile Section */}
				<div className="flex items-start gap-6 mb-8">
					<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
						<User className="w-12 h-12 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{bitcoiner.name}
						</h1>
						<div className="flex items-center gap-4">
							<Badge variant="outline">Active</Badge>
							<span className="text-sm text-muted-foreground">
								{bitcoiner.socialMedia.length} social link
								{bitcoiner.socialMedia.length !== 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</div>

				{/* Social Media Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Share2 className="w-5 h-5" />
							Social Media
						</CardTitle>
					</CardHeader>
					<CardContent>
						{bitcoiner.socialMedia.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{bitcoiner.socialMedia.map((social) => (
									<SocialMediaCard key={social.id} social={social} />
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p>No social media links added yet</p>
								<Button
									variant="outline"
									className="mt-4"
									href={`/bitcoiner/edit/${bitcoiner.id}`}
								>
									Add Social Media Links
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
```

#### Features

- **Profile Header**: Large profile section with name and status
- **Action Buttons**: Edit and delete functionality
- **Social Media Grid**: Organized display of all social media links
- **Back Navigation**: Easy return to list page
- **Responsive Layout**: Adapts to different screen sizes

### 3. Create Bitcoiner Page (`/bitcoiner/create`)

**Route**: `src/app/bitcoiner/create/page.tsx`
**Component**: `src/components/pages/bitcoiner/CreateBitcoinerPage.tsx`

#### Layout Structure

```tsx
<div className="min-h-screen bg-background">
	{/* Fixed Header - follows established pattern */}
	<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
		<div className="container mx-auto px-4 py-4">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					href="/bitcoiner"
					className="text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Bitcoiners
				</Button>

				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Add New Bitcoiner
					</h1>
					<p className="text-sm text-muted-foreground">
						Create a new bitcoiner profile
					</p>
				</div>
			</div>
		</div>
	</div>

	{/* Main Content - with proper navbar clearance and scrollable content */}
	<div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
		<div className="container mx-auto px-4">
			<div className="max-w-2xl mx-auto">
				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Bitcoiner Information</CardTitle>
						<CardDescription>
							Fill in the details for the new bitcoiner
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BitcoinerForm
							onSubmit={handleSubmit}
							onCancel={() => router.push('/bitcoiner')}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
```

#### Features

- **Clean Form Layout**: Centered form with clear instructions
- **Validation**: Real-time form validation with error messages
- **Social Media Management**: Dynamic add/remove social media links
- **Loading States**: Proper loading indicators during submission
- **Cancel Functionality**: Easy way to cancel and return to list

### 4. Edit Bitcoiner Page (`/bitcoiner/edit/[id]`)

**Route**: `src/app/bitcoiner/edit/[id]/page.tsx`
**Component**: `src/components/pages/bitcoiner/EditBitcoinerPage.tsx`

#### Layout Structure

```tsx
<div className="min-h-screen bg-background">
	{/* Fixed Header - follows established pattern */}
	<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
		<div className="container mx-auto px-4 py-4">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					href={`/bitcoiner/${bitcoiner.id}`}
					className="text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Profile
				</Button>

				<div>
					<h1 className="text-2xl font-bold text-foreground">Edit Bitcoiner</h1>
					<p className="text-sm text-muted-foreground">
						Update {bitcoiner.name}'s information
					</p>
				</div>
			</div>
		</div>
	</div>

	{/* Main Content - with proper navbar clearance and scrollable content */}
	<div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
		<div className="container mx-auto px-4">
			<div className="max-w-2xl mx-auto">
				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Edit Bitcoiner Information</CardTitle>
						<CardDescription>
							Update the bitcoiner's details and social media links
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BitcoinerForm
							bitcoiner={bitcoiner}
							onSubmit={handleSubmit}
							onCancel={() => router.push(`/bitcoiner/${bitcoiner.id}`)}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
```

#### Features

- **Pre-populated Form**: Form fields filled with existing data
- **Update Functionality**: Save changes to existing bitcoiner
- **Cancel to Profile**: Return to bitcoiner detail page
- **Same Validation**: Consistent validation as create form

## Component Specifications

### BitcoinerCard Component

**Location**: `src/components/pages/bitcoiner/BitcoinerCard.tsx`

#### Design

```tsx
interface BitcoinerCardProps {
	bitcoiner: Bitcoiner
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
	showActions?: boolean
}

const BitcoinerCard: React.FC<BitcoinerCardProps> = ({
	bitcoiner,
	onEdit,
	onDelete,
	showActions = false,
}) => {
	return (
		<Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
			<CardContent className="p-6">
				{/* Profile Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
							<User className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-lg text-foreground truncate">
								{bitcoiner.name}
							</h3>
							<p className="text-sm text-muted-foreground">
								{bitcoiner.socialMedia.length} social link
								{bitcoiner.socialMedia.length !== 1 ? 's' : ''}
							</p>
						</div>
					</div>
					{showActions && (
						<div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
							<Button
								size="sm"
								variant="outline"
								onClick={() => onEdit?.(bitcoiner.id)}
							>
								<Edit className="w-3 h-3" />
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => onDelete?.(bitcoiner.id)}
							>
								<Trash2 className="w-3 h-3" />
							</Button>
						</div>
					)}
				</div>

				{/* Social Media Links */}
				<div className="space-y-2">
					{bitcoiner.socialMedia.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{bitcoiner.socialMedia.slice(0, 3).map((social) => (
								<a
									key={social.id}
									href={social.urlLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground transition-colors"
									title={social.displayText}
								>
									<SocialIcon platform={social.platform} className="w-3 h-3" />
									<span className="truncate max-w-[100px]">
										{social.username}
									</span>
								</a>
							))}
							{bitcoiner.socialMedia.length > 3 && (
								<span className="text-xs text-muted-foreground">
									+{bitcoiner.socialMedia.length - 3} more
								</span>
							)}
						</div>
					) : (
						<div className="text-center py-4 text-muted-foreground">
							<Share2 className="w-6 h-6 mx-auto mb-2 opacity-50" />
							<p className="text-xs">No social media links</p>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="mt-4 pt-4 border-t">
					<div className="flex justify-between items-center">
						<Button
							variant="ghost"
							size="sm"
							href={`/bitcoiner/${bitcoiner.id}`}
							className="text-primary hover:text-primary/80"
						>
							View Profile
						</Button>
						{showActions && (
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
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
```

#### Features

- **Hover Effects**: Subtle animations and color changes
- **Social Media Preview**: Shows up to 3 social media links
- **Action Buttons**: Edit/delete functionality (when enabled)
- **Responsive Design**: Adapts to different card sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

### BitcoinerForm Component

**Location**: `src/components/pages/bitcoiner/BitcoinerForm.tsx`

#### Design

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
		socialMedia: bitcoiner?.socialMedia || [],
	})

	const addSocialMedia = () => {
		setFormData((prev) => ({
			...prev,
			socialMedia: [
				...prev.socialMedia,
				{
					id: `temp-${Date.now()}`,
					displayText: '',
					username: '',
					platform: 'facebook',
					urlLink: '',
				},
			],
		}))
	}

	const updateSocialMedia = (
		index: number,
		field: keyof SocialMedia,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: prev.socialMedia.map((social, i) =>
				i === index ? { ...social, [field]: value } : social
			),
		}))
	}

	const removeSocialMedia = (index: number) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: prev.socialMedia.filter((_, i) => i !== index),
		}))
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Name Field */}
			<div>
				<Label htmlFor="name" className="text-sm font-medium">
					Name *
				</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="Enter bitcoiner name"
					required
					className="mt-1"
				/>
				{errors.name && (
					<p className="text-sm text-destructive mt-1">{errors.name}</p>
				)}
			</div>

			{/* Social Media Section */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<Label className="text-sm font-medium">Social Media Links</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addSocialMedia}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Link
					</Button>
				</div>

				<div className="space-y-4">
					{formData.socialMedia.map((social, index) => (
						<Card key={social.id} className="p-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor={`platform-${index}`} className="text-xs">
										Platform
									</Label>
									<Select
										value={social.platform}
										onValueChange={(value) =>
											updateSocialMedia(index, 'platform', value)
										}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select platform" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="facebook">Facebook</SelectItem>
											<SelectItem value="youtube">YouTube</SelectItem>
											<SelectItem value="twitter">Twitter</SelectItem>
											<SelectItem value="linkedin">LinkedIn</SelectItem>
											<SelectItem value="instagram">Instagram</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor={`username-${index}`} className="text-xs">
										Username
									</Label>
									<Input
										id={`username-${index}`}
										value={social.username}
										onChange={(e) =>
											updateSocialMedia(index, 'username', e.target.value)
										}
										placeholder="Enter username"
										className="mt-1"
									/>
								</div>

								<div>
									<Label htmlFor={`displayText-${index}`} className="text-xs">
										Display Text
									</Label>
									<Input
										id={`displayText-${index}`}
										value={social.displayText}
										onChange={(e) =>
											updateSocialMedia(index, 'displayText', e.target.value)
										}
										placeholder="e.g., เพจ BLC Chiang Mai"
										className="mt-1"
									/>
								</div>

								<div className="flex items-end gap-2">
									<div className="flex-1">
										<Label htmlFor={`urlLink-${index}`} className="text-xs">
											URL
										</Label>
										<Input
											id={`urlLink-${index}`}
											value={social.urlLink}
											onChange={(e) =>
												updateSocialMedia(index, 'urlLink', e.target.value)
											}
											placeholder="https://..."
											className="mt-1"
										/>
									</div>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => removeSocialMedia(index)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</Card>
					))}

					{formData.socialMedia.length === 0 && (
						<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
							<Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
							<p className="text-sm">No social media links added yet</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addSocialMedia}
								className="mt-2"
							>
								Add First Link
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end space-x-4 pt-6 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading || !formData.name.trim()}>
					{isLoading ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							{bitcoiner ? 'Updating...' : 'Creating...'}
						</>
					) : bitcoiner ? (
						'Update Bitcoiner'
					) : (
						'Create Bitcoiner'
					)}
				</Button>
			</div>
		</form>
	)
}
```

#### Features

- **Dynamic Social Media**: Add/remove social media links dynamically
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Proper loading indicators during submission
- **Responsive Layout**: Grid layout that adapts to screen size
- **Empty State**: Friendly message when no social media links

### BitcoinerFilters Component

**Location**: `src/components/pages/bitcoiner/BitcoinerFilters.tsx`

#### Design

```tsx
interface BitcoinerFiltersProps {
	searchTerm: string
	onSearchChange: (term: string) => void
	selectedPlatform: string
	onPlatformChange: (platform: string) => void
	onClearFilters: () => void
}

const BitcoinerFilters: React.FC<BitcoinerFiltersProps> = ({
	searchTerm,
	onSearchChange,
	selectedPlatform,
	onPlatformChange,
	onClearFilters,
}) => {
	return (
		<Card className="mb-6">
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search Input */}
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								placeholder="Search bitcoiners..."
								value={searchTerm}
								onChange={(e) => onSearchChange(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Platform Filter */}
					<div className="w-full sm:w-48">
						<Select value={selectedPlatform} onValueChange={onPlatformChange}>
							<SelectTrigger>
								<SelectValue placeholder="All platforms" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">All platforms</SelectItem>
								<SelectItem value="facebook">Facebook</SelectItem>
								<SelectItem value="youtube">YouTube</SelectItem>
								<SelectItem value="twitter">Twitter</SelectItem>
								<SelectItem value="linkedin">LinkedIn</SelectItem>
								<SelectItem value="instagram">Instagram</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Clear Filters */}
					{(searchTerm || selectedPlatform) && (
						<Button variant="outline" onClick={onClearFilters}>
							<X className="w-4 h-4 mr-2" />
							Clear
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
```

#### Features

- **Search Functionality**: Real-time search by name
- **Platform Filter**: Filter by social media platform
- **Clear Filters**: Easy way to reset all filters
- **Responsive Layout**: Adapts to different screen sizes

### SocialMediaCard Component

**Location**: `src/components/pages/bitcoiner/SocialMediaCard.tsx`

#### Design

```tsx
interface SocialMediaCardProps {
	social: SocialMedia
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ social }) => {
	return (
		<a
			href={social.urlLink}
			target="_blank"
			rel="noopener noreferrer"
			className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
		>
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
					<SocialIcon
						platform={social.platform}
						className="w-5 h-5 text-muted-foreground group-hover:text-primary"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<h4 className="font-medium text-foreground truncate">
						{social.displayText}
					</h4>
					<p className="text-sm text-muted-foreground truncate">
						@{social.username}
					</p>
				</div>
				<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
			</div>
		</a>
	)
}
```

#### Features

- **Clickable Links**: Direct links to social media profiles
- **Platform Icons**: Visual representation of each platform
- **Hover Effects**: Subtle animations on hover
- **Responsive Design**: Adapts to different card sizes

## Responsive Design Specifications

### Breakpoints

- **Mobile**: < 768px (Single column, full-width cards)
- **Tablet**: 768px - 1024px (2-3 column layouts)
- **Desktop**: > 1024px (3-4 column layouts)

### Mobile-First Features

- **Touch Targets**: Minimum 44px for all interactive elements
- **Typography**: Responsive font sizes using Tailwind classes
- **Navigation**: Touch-friendly button sizes and spacing
- **Cards**: Full-width on mobile, constrained on desktop
- **Forms**: Stacked layout on mobile, grid on desktop

## Dark Mode Implementation

### Theme Integration

- **CSS Custom Properties**: Uses established theme variables
- **Component Adaptation**: All components support both themes
- **Icon Colors**: Icons adapt to theme automatically
- **Hover States**: Consistent hover effects in both themes

### Dark Mode Specific Features

- **Card Borders**: Subtle borders that work in both themes
- **Text Contrast**: Proper contrast ratios maintained
- **Background Colors**: Consistent background hierarchy
- **Social Media Icons**: Platform-specific colors that work in both themes

## Accessibility Features

### Keyboard Navigation

- **Tab Order**: Logical tab sequence through all interactive elements
- **Focus Indicators**: Clear focus states for all interactive elements
- **Skip Links**: Skip to main content functionality
- **Form Labels**: Proper labeling for all form inputs

### Screen Reader Support

- **ARIA Labels**: Descriptive labels for all interactive elements
- **Semantic HTML**: Proper use of semantic HTML elements
- **Alt Text**: Descriptive alt text for all images
- **Live Regions**: Announcements for dynamic content changes

### Color and Contrast

- **WCAG AA Compliance**: Minimum 4.5:1 contrast ratio for normal text
- **Color Independence**: Information not conveyed by color alone
- **Focus Indicators**: High contrast focus indicators
- **Error States**: Clear error messaging with proper contrast

## Performance Considerations

### Loading States

- **Skeleton Loaders**: For card grids and detail pages
- **Progressive Loading**: Load content as it becomes available
- **Image Optimization**: Optimized images with proper sizing
- **Lazy Loading**: Load components only when needed

### Data Fetching

- **Server-Side Rendering**: Initial page loads with SSR
- **Client-Side Caching**: Efficient data caching strategies
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Boundaries**: Graceful error handling

## Testing Strategy

### Component Testing

- **Unit Tests**: Individual component testing with React Testing Library
- **Integration Tests**: Component interaction testing
- **Visual Tests**: Responsive layout testing
- **Accessibility Tests**: Screen reader and keyboard navigation testing

### User Experience Testing

- **Mobile Testing**: Various mobile device testing
- **Browser Testing**: Cross-browser compatibility
- **Performance Testing**: Load time and interaction testing
- **Usability Testing**: User flow and interaction testing

## Implementation Guidelines

### Before Implementation

1. **Read Requirements**: Always read `ai/requirement-spec.md` before starting
2. **Understand Context**: Review existing components and patterns
3. **Check Public Components**: Look for reusable components in `src/components/pages/public/`
4. **Plan Dark Mode**: Ensure all new components support dark mode
5. **Follow Design System**: Use established patterns and components

### Component Development

1. **Use Public Components**: Import and use existing public components
2. **Implement Dark Mode**: Add dark mode support to all new components
3. **Follow TypeScript**: Use proper TypeScript interfaces
4. **Add Documentation**: Include JSDoc comments for new components
5. **Test Responsiveness**: Ensure components work on all screen sizes

### Quality Assurance

1. **Accessibility**: Test with screen readers and keyboard navigation
2. **Performance**: Optimize images and loading states
3. **Cross-browser**: Test on different browsers and devices
4. **Theme Testing**: Verify both light and dark modes work correctly
5. **Mobile Testing**: Ensure mobile-first design principles are followed

## Conclusion

The bitcoiner page design specification provides:

- ✅ **Complete Page Set**: List, detail, create, and edit pages
- ✅ **Responsive Design**: Mobile-first approach with proper breakpoints
- ✅ **Component Library**: Reusable components following design system
- ✅ **Accessibility**: WCAG 2.1 AA compliance with proper contrast
- ✅ **Dark Mode Support**: Complete theme system integration
- ✅ **Performance**: Optimized loading and interaction patterns
- ✅ **Testing Strategy**: Comprehensive testing approach
- ✅ **Implementation Guidelines**: Clear development guidelines

All pages follow the established design patterns and are ready for production use. The design ensures consistency, maintainability, and user experience across the entire bitcoiner management system.
