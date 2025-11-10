'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useBitcoiners } from '@/hooks/useBitcoiner'
import { CreateBitcoinerRequest } from '@/types/bitcoiner'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { BitcoinerForm } from './BitcoinerForm'

export const CreateBitcoinerPage: React.FC = () => {
	const router = useRouter()
	const { createBitcoiner, loading } = useBitcoiners()

	const handleSubmit = async (data: CreateBitcoinerRequest) => {
		try {
			await createBitcoiner(data)
			// After creation, the list will refresh and we can navigate
			router.push('/bitcoiner')
		} catch (error) {
			console.error('Error creating bitcoiner:', error)
			alert('Failed to create bitcoiner')
		}
	}

	const handleCancel = () => {
		router.push('/bitcoiner')
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
