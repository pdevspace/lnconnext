'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOrganizer } from '@/hooks/useOrganizer'
import { UpdateOrganizerRequest } from '@/types/organizer'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { OrganizerForm } from './OrganizerForm'

interface EditOrganizerPageProps {
	organizerId: string
}

export const EditOrganizerPage: React.FC<EditOrganizerPageProps> = ({
	organizerId,
}) => {
	const router = useRouter()
	const { organizer, loading, error, updateOrganizer } =
		useOrganizer(organizerId)

	const handleSubmit = async (data: Omit<UpdateOrganizerRequest, 'id'>) => {
		try {
			await updateOrganizer(data)
			router.push(`/organizer/${organizerId}`)
		} catch (error) {
			console.error('Error updating organizer:', error)
			alert('Failed to update organizer')
		}
	}

	const handleCancel = () => {
		router.push(`/organizer/${organizerId}`)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="animate-pulse">
							<div className="h-8 bg-muted rounded w-32 mb-6"></div>
							<div className="h-8 bg-muted rounded w-64 mb-2"></div>
							<div className="h-4 bg-muted rounded w-96 mb-8"></div>
							<div className="h-96 bg-muted rounded"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-destructive mb-4">
									Something went wrong
								</h2>
								<p className="text-muted-foreground mb-4">{error}</p>
								<Button onClick={() => router.push('/organizer')}>
									Back to Organizers
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!organizer) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-foreground mb-4">
									Organizer not found
								</h2>
								<p className="text-muted-foreground mb-4">
									The organizer you&apos;re trying to edit doesn&apos;t exist or
									has been removed.
								</p>
								<Button onClick={() => router.push('/organizer')}>
									Back to Organizers
								</Button>
							</div>
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
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={handleCancel}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Profile
						</Button>

						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Edit Organizer
							</h1>
							<p className="text-sm text-muted-foreground">
								Update {organizer.name}&apos;s information
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[130px] w-full">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto">
						{/* Form */}
						<Card>
							<CardContent className="p-6">
								<OrganizerForm
									organizer={organizer}
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									isLoading={loading}
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
