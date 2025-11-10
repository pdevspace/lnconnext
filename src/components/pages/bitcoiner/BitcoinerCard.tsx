'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SocialIcon } from '@/components/ui/social-icon'
import { Bitcoiner } from '@/types/bitcoiner'

import Link from 'next/link'

import { Share2, User } from 'lucide-react'

interface BitcoinerCardProps {
	bitcoiner: Bitcoiner
}

export const BitcoinerCard: React.FC<BitcoinerCardProps> = ({ bitcoiner }) => {
	return (
		<Link href={`/bitcoiner/${bitcoiner.id}`} className="block">
			<Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group cursor-pointer">
				<CardContent className="p-6">
					{/* Profile Header */}
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
								<User className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-lg text-foreground truncate">
									{bitcoiner.name}
								</h3>
							</div>
						</div>
					</div>

					{/* Social Media Links */}
					<div className="h-6">
						{bitcoiner.socialMedia.length > 0 ? (
							<div className="flex gap-2 overflow-x-auto scrollbar-hide">
								{bitcoiner.socialMedia.map((social) => (
									<div
										key={social.id}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground whitespace-nowrap flex-shrink-0"
										title={social.displayText}
									>
										<SocialIcon
											platform={social.platform}
											className="w-3 h-3"
										/>
										<span className="truncate max-w-[100px]">
											{social.displayText}
										</span>
									</div>
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
		</Link>
	)
}
