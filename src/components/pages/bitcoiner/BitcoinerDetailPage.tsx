'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBitcoiner } from '@/hooks/useBitcoiner'
import { useIsEditor } from '@/hooks/useUser'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
	ArrowLeft,
	Edit,
	ExternalLink,
	Share2,
	Trash2,
	User,
} from 'lucide-react'

import { SocialMediaCard } from './SocialMediaCard'

interface BitcoinerDetailPageProps {
	bitcoinerId: string
}

export const BitcoinerDetailPage: React.FC<BitcoinerDetailPageProps> = ({
	bitcoinerId,
}) => {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const { bitcoiner, loading, error, deleteBitcoiner } =
		useBitcoiner(bitcoinerId)

	const handleDelete = async () => {
		if (
			confirm(
				'Are you sure you want to delete this bitcoiner? This action cannot be undone.'
			)
		) {
			try {
				await deleteBitcoiner()
				router.push('/bitcoiner')
			} catch (error) {
				console.error('Error deleting bitcoiner:', error)
				alert('Failed to delete bitcoiner')
			}
		}
	}

	if (loading) {
		return (
			<div className="bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<div className="animate-pulse">
							<div className="h-8 bg-muted rounded w-32 mb-6"></div>
							<div className="flex items-start gap-6 mb-8">
								<div className="w-24 h-24 bg-muted rounded-full"></div>
								<div className="flex-1">
									<div className="h-8 bg-muted rounded w-64 mb-2"></div>
									<div className="h-4 bg-muted rounded w-32"></div>
								</div>
							</div>
							<div className="h-64 bg-muted rounded"></div>
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
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-destructive mb-4">
									Something went wrong
								</h2>
								<p className="text-muted-foreground mb-4">{error}</p>
								<Button onClick={() => router.push('/bitcoiner')}>
									Back to Bitcoiners
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!bitcoiner) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-foreground mb-4">
									Bitcoiner not found
								</h2>
								<p className="text-muted-foreground mb-4">
									The bitcoiner you&apos;re looking for doesn&apos;t exist or
									has been removed.
								</p>
								<Button onClick={() => router.push('/bitcoiner')}>
									Back to Bitcoiners
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
							onClick={() => router.push('/bitcoiner')}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Bitcoiners
						</Button>

						{/* Action Buttons */}
						{isEditor && (
							<div className="flex gap-2">
								<Button
									onClick={() => router.push(`/bitcoiner/edit/${bitcoiner.id}`)}
									variant="outline"
								>
									<Edit className="w-4 h-4 mr-2" />
									Edit
								</Button>
								<Button variant="destructive" onClick={handleDelete}>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[130px] w-full">
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
								<div className="flex items-center gap-4 mb-4">
									<Badge variant="outline">Active</Badge>
									<span className="text-sm text-muted-foreground">
										{bitcoiner.socialMedia.length} social link
										{bitcoiner.socialMedia.length !== 1 ? 's' : ''}
									</span>
								</div>
								{bitcoiner.bio && (
									<p className="text-muted-foreground whitespace-pre-wrap">
										{bitcoiner.bio}
									</p>
								)}
							</div>
						</div>

						{/* Organizer Section */}
						{bitcoiner.organizerId && bitcoiner.organizerName && (
							<Card className="mb-8">
								<CardHeader>
									<CardTitle>Organizer</CardTitle>
								</CardHeader>
								<CardContent>
									<Link
										href={`/organizer/${bitcoiner.organizerId}`}
										className="block"
									>
										<Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
											<CardContent className="p-4">
												<div className="flex items-center justify-between">
													<div className="flex-1 min-w-0">
														<h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
															{bitcoiner.organizerName}
														</h4>
														<p className="text-sm text-muted-foreground mt-1">
															Click to view organizer details
														</p>
													</div>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
												</div>
											</CardContent>
										</Card>
									</Link>
								</CardContent>
							</Card>
						)}

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
											onClick={() =>
												router.push(`/bitcoiner/edit/${bitcoiner.id}`)
											}
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
	)
}
