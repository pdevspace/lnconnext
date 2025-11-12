'use client'

import { Button } from '@/components/ui/button'
import { useBitcoiners } from '@/hooks/useBitcoiner'
import { useIsEditor } from '@/hooks/useUser'
import { BitcoinerFilters } from '@/types/bitcoiner'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Plus, Share2 } from 'lucide-react'

import { BitcoinerCard } from './BitcoinerCard'
import { BitcoinerFilters as BitcoinerFiltersComponent } from './BitcoinerFilters'

export const BitcoinerListPage: React.FC = () => {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const [filters, setFilters] = useState<BitcoinerFilters>({
		searchTerm: '',
		selectedPlatform: '',
	})

	const { bitcoiners, loading, error, fetchBitcoiners } = useBitcoiners(filters)

	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-destructive mb-4">
								Something went wrong
							</h2>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={() => fetchBitcoiners()}>Try again</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="h-screen overflow-y-auto bg-background">
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
						{isEditor && (
							<Button
								onClick={() => router.push('/bitcoiner/create')}
								className="mt-4 sm:mt-0"
								size="lg"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add New Bitcoiner
							</Button>
						)}
					</div>

					{/* Search and Filter Section */}
					<div className="mt-6">
						<BitcoinerFiltersComponent
							searchTerm={filters?.searchTerm || ''}
							onSearchChange={(searchTerm) =>
								setFilters((prev) => ({ ...prev, searchTerm }))
							}
							selectedPlatform={filters?.selectedPlatform || ''}
							onPlatformChange={(selectedPlatform) =>
								setFilters((prev) => ({ ...prev, selectedPlatform }))
							}
							onClearFilters={() =>
								setFilters({ searchTerm: '', selectedPlatform: '' })
							}
						/>
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

					{/* Bitcoiners Grid */}
					{!loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{bitcoiners.map((bitcoiner) => (
								<BitcoinerCard key={bitcoiner.id} bitcoiner={bitcoiner} />
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && bitcoiners.length === 0 && (
						<div className="text-center py-16">
							<Share2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No bitcoiners found
							</h3>
							<p className="text-muted-foreground mb-6">
								Try adjusting your search or filter criteria, or get started by
								adding your first bitcoiner to the community.
							</p>
							{isEditor && (
								<Button onClick={() => router.push('/bitcoiner/create')}>
									<Plus className="w-4 h-4 mr-2" />
									Add First Bitcoiner
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
