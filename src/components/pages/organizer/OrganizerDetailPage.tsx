'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganizer } from '@/hooks/useOrganizer'
import { useIsEditor } from '@/hooks/useUser'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
	ArrowLeft,
	Building2,
	Edit,
	ExternalLink,
	Globe,
	Share2,
	Trash2,
	User,
	Users,
} from 'lucide-react'

import { SocialMediaCard } from '../bitcoiner/SocialMediaCard'

interface OrganizerDetailPageProps {
	organizerId: string
}

export function OrganizerDetailPage({ organizerId }: OrganizerDetailPageProps) {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const { organizer, loading, error, deleteOrganizer } =
		useOrganizer(organizerId)

	const handleDelete = async () => {
		if (
			confirm(
				'Are you sure you want to delete this organizer? This action cannot be undone.'
			)
		) {
			try {
				await deleteOrganizer()
				router.push('/organizer')
			} catch (error) {
				console.error('Error deleting organizer:', error)
				alert('Failed to delete organizer')
			}
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
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
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-foreground mb-4">
									Organizer not found
								</h2>
								<p className="text-muted-foreground mb-4">
									The organizer you&apos;re looking for doesn&apos;t exist or
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
							onClick={() => router.push('/organizer')}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Organizers
						</Button>

						{/* Action Buttons */}
						{isEditor && (
							<div className="flex gap-2">
								<Button
									onClick={() => router.push(`/organizer/edit/${organizer.id}`)}
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
								<Building2 className="w-12 h-12 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-foreground mb-2">
									{organizer.name}
								</h1>
								<div className="flex items-center gap-4 mb-4">
									<Badge variant="outline">Active</Badge>
									<span className="text-sm text-muted-foreground">
										{organizer.socialMedia.length} social link
										{organizer.socialMedia.length !== 1 ? 's' : ''}
									</span>
									{organizer.website && (
										<Link
											href={organizer.website}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1 text-sm text-primary hover:underline"
										>
											<Globe className="w-4 h-4" />
											Website
										</Link>
									)}
								</div>
								{organizer.bio && (
									<p className="text-muted-foreground whitespace-pre-wrap">
										{organizer.bio}
									</p>
								)}
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
								{organizer.socialMedia.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{organizer.socialMedia.map((social) => (
											<SocialMediaCard
												key={social.id}
												social={
													social as {
														id: string
														displayText: string
														platform: string
														urlLink: string
													}
												}
											/>
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
												router.push(`/organizer/edit/${organizer.id}`)
											}
										>
											Add Social Media Links
										</Button>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Members Section */}
						<Card className="mb-8">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="w-5 h-5" />
									Members
									{organizer.members && organizer.members.length > 0 && (
										<Badge variant="outline" className="ml-2">
											{organizer.members.length}
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								{organizer.members && organizer.members.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{organizer.members.map((member) => (
											<Link
												key={member.id}
												href={`/bitcoiner/${member.id}`}
												className="block group"
											>
												<Card className="hover:bg-muted/50 transition-colors cursor-pointer group-hover:shadow-md">
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors flex-shrink-0">
																	<User className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
																</div>
																<div className="flex-1 min-w-0">
																	<h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
																		{member.name}
																	</h4>
																	<p className="text-sm text-muted-foreground">
																		Click to view profile
																	</p>
																</div>
															</div>
															<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
														</div>
													</CardContent>
												</Card>
											</Link>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>No members added yet</p>
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
