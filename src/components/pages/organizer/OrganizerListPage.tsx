'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { useOrganizers } from '@/hooks/useOrganizer'
import { useIsEditor } from '@/hooks/useUser'
import { ListOrganizerRequest, ListOrganizerResponse } from '@/types/organizer'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Building2, Plus } from 'lucide-react'

import { OrganizerCard } from './OrganizerCard'

interface OrganizerListPageProps {
	initialData?: ListOrganizerResponse
}

export function OrganizerListPage({ initialData }: OrganizerListPageProps) {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const { showError } = useToast()
	const [filters, setFilters] = useState<ListOrganizerRequest['filters']>({
		searchTerm: '',
		selectedPlatform: '',
	})

	// Check if initialData is empty or doesn't exist
	const shouldUseHook = !initialData || initialData.organizers.length === 0

	// Only call hook when initialData is missing or empty
	// Pass enabled=false when initialData exists to prevent API calls
	const {
		organizers: hookOrganizers,
		loading,
		error,
	} = useOrganizers(filters, shouldUseHook)

	useEffect(() => {
		if (error) {
			showError(error)
		}
	}, [error, showError])

	// Frontend filtering - filter the initialData on the client side
	const filteredOrganizers = useMemo(() => {
		// If using hook, return hook data directly (hook handles filtering server-side)
		if (shouldUseHook) {
			return hookOrganizers
		}

		// Otherwise, filter initialData on client side
		if (!initialData?.organizers) {
			return []
		}

		let filtered = [...initialData.organizers]

		// Filter by search term (name)
		if (filters?.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase()
			filtered = filtered.filter((organizer) =>
				organizer.name.toLowerCase().includes(searchLower)
			)
		}

		// Filter by platform
		if (filters?.selectedPlatform) {
			filtered = filtered.filter((organizer) =>
				organizer.socialMedia.some(
					(sm) => sm.platform === filters.selectedPlatform
				)
			)
		}

		return filtered
	}, [
		shouldUseHook,
		hookOrganizers,
		initialData?.organizers,
		filters?.searchTerm,
		filters?.selectedPlatform,
	])

	const organizers = filteredOrganizers

	return (
		<div className="h-screen overflow-y-auto bg-background">
			{/* Fixed Header - follows established pattern */}
			<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
				<div className="container mx-auto px-4 py-4">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
						<div>
							<h1 className="text-3xl font-bold text-foreground mb-2">
								Organizers
							</h1>
							<p className="text-muted-foreground">
								Discover and connect with event organizers in the Bitcoin
								community
							</p>
						</div>
						{isEditor && (
							<Button
								onClick={() => router.push('/organizer/create')}
								className="mt-4 sm:mt-0"
								size="lg"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add New Organizer
							</Button>
						)}
					</div>

					{/* Search and Filter Section */}
					<div className="mt-6">
						<div className="flex gap-4">
							<input
								type="text"
								placeholder="Search organizers..."
								value={filters?.searchTerm || ''}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										searchTerm: e.target.value,
									}))
								}
								className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground"
							/>
							<select
								value={filters?.selectedPlatform || ''}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										selectedPlatform: e.target.value || undefined,
									}))
								}
								className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
							>
								<option value="">All Platforms</option>
								<option value="facebook">Facebook</option>
								<option value="youtube">YouTube</option>
								<option value="twitter">Twitter</option>
								<option value="linkedin">LinkedIn</option>
								<option value="instagram">Instagram</option>
								<option value="other">Other</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[264px] w-full">
				<div className="container mx-auto px-4">
					{/* Loading State */}
					{loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="bg-muted rounded-lg h-48"></div>
								</div>
							))}
						</div>
					)}

					{/* Organizers Grid */}
					{!loading && organizers.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{organizers.map((organizer) => (
								<OrganizerCard key={organizer.id} organizer={organizer} />
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && organizers.length === 0 && (
						<div className="text-center py-16">
							<Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No organizers found
							</h3>
							<p className="text-muted-foreground mb-6">
								Try adjusting your search or filter criteria, or get started by
								adding your first organizer to the community.
							</p>
							{isEditor && (
								<Button onClick={() => router.push('/organizer/create')}>
									<Plus className="w-4 h-4 mr-2" />
									Add First Organizer
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
