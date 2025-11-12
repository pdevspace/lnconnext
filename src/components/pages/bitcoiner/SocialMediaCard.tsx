'use client'

import { SocialIcon } from '@/components/ui/social-icon'
import { BitcoinerSocialMedia } from '@/types/bitcoiner'

import Link from 'next/link'

import { ExternalLink } from 'lucide-react'

interface SocialMediaCardProps {
	social: BitcoinerSocialMedia
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ social }) => {
	return (
		<Link
			key={social.id}
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
						{social.platform}
					</p>
				</div>
				<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
			</div>
		</Link>
	)
}
