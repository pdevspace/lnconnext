'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOrganizer } from '@/hooks/useOrganizer'
import { OrganizerFormData } from '@/types-old/organizer'

import { useState } from 'react'

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
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (data: OrganizerFormData) => {
		setIsSubmitting(true)

		try {
			await updateOrganizer(data)
			router.push(`/organizer/${organizerId}`)
		} catch (error) {
			console.error('Error updating organizer:', error)
			alert('Failed to update organizer')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCancel = () => {
		router.push(`/organizer/${organizerId}`)
	}

	if (loading) {
		return (
			<div className="h-screen overflow-y-auto bg-background">
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
			<div className="h-screen overflow-y-auto bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
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
		)
	}

	if (!organizer) {
		return (
			<div className="h-screen overflow-y-auto bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-foreground mb-4">
								Organizer not found
							</h2>
							<p className="text-muted-foreground mb-4">
								The organizer you're trying to edit doesn't exist or has been
								removed.
							</p>
							<Button onClick={() => router.push('/organizer')}>
								Back to Organizers
							</Button>
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
							onClick={() => router.push(`/organizer/${organizerId}`)}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Organizer
						</Button>
						<h1 className="text-xl font-semibold">Edit Organizer</h1>
						<div className="w-20"></div> {/* Spacer for centering */}
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[130px] w-full">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto">
						<Card>
							<CardContent className="p-6">
								<OrganizerForm
									initialData={{
										name: organizer.name,
										bio: organizer.bio || '',
										avatar: organizer.avatar || '',
										website: organizer.website || '',
										isActive: organizer.isActive,
										socialMediaIds: organizer.socialMedia.map((sm) => sm.id),
									}}
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									isSubmitting={isSubmitting}
									submitLabel="Update Organizer"
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
