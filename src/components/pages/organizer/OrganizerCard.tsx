'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SocialIcon } from '@/components/ui/social-icon'
import { ListOrganizerItem } from '@/types/organizer'
import { useAuth } from '@/utils/AuthContext'

import { useRouter } from 'next/navigation'

import { Building2, Lock } from 'lucide-react'

interface OrganizerCardProps {
	organizer: ListOrganizerItem
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
	const router = useRouter()
	const { user } = useAuth()

	const handleCardClick = () => {
		if (!user) {
			// Just return without any action
			return
		}
		router.push(`/organizer/${organizer.id}`)
	}

	const isDisabled = !user

	return (
		<Card
			className={`transition-all duration-200 group ${
				isDisabled
					? 'opacity-60 cursor-not-allowed'
					: 'hover:shadow-lg cursor-pointer'
			}`}
			onClick={handleCardClick}
		>
			<CardContent className="p-6">
				{/* Profile Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div
							className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-colors ${
								isDisabled ? '' : 'group-hover:bg-primary/10'
							}`}
						>
							<Building2
								className={`w-6 h-6 text-muted-foreground ${
									isDisabled ? '' : 'group-hover:text-primary'
								}`}
							/>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-lg text-foreground truncate">
								{organizer.name}
							</h3>
							{isDisabled && (
								<div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
									<Lock className="w-3 h-3" />
									<span>Login to view details</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Social Media Links */}
				<div className="h-6">
					{organizer.socialMedia.length > 0 ? (
						<div className="flex gap-2 overflow-x-auto scrollbar-hide">
							{organizer.socialMedia.map((social) => (
								<a
									key={social.id}
									href={social.urlLink}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
									title={social.displayText || social.platform}
								>
									<SocialIcon platform={social.platform} className="w-3 h-3" />
									<span className="truncate max-w-[100px]">
										{social.displayText || social.platform}
									</span>
								</a>
							))}
						</div>
					) : (
						<div className="text-xs text-muted-foreground h-6 flex items-center">
							No social media links
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
