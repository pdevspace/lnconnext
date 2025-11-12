'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useOrganizers } from '@/hooks/useOrganizer'
import { CreateOrganizerRequest } from '@/types/organizer'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { OrganizerForm } from './OrganizerForm'

export const CreateOrganizerPage: React.FC = () => {
	const router = useRouter()
	const { createOrganizer, loading } = useOrganizers()

	const handleSubmit = async (data: CreateOrganizerRequest) => {
		try {
			await createOrganizer(data)
			// After creation, the list will refresh and we can navigate
			router.push('/organizer')
		} catch (error) {
			console.error('Error creating organizer:', error)
			alert('Failed to create organizer')
		}
	}

	const handleCancel = () => {
		router.push('/organizer')
	}

	return (
		<div className="min-h-screen bg-background">
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
							Back to Organizers
						</Button>

						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Add New Organizer
							</h1>
							<p className="text-sm text-muted-foreground">
								Create a new organizer profile
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance */}
			<div className="px-0 py-6 mt-[130px] w-full">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto">
						{/* Form */}
						<Card>
							<CardHeader>
								<CardTitle>Organizer Information</CardTitle>
								<CardDescription>
									Fill in the details for the new organizer
								</CardDescription>
							</CardHeader>
							<CardContent>
								<OrganizerForm
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
