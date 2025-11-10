'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
	Bitcoiner,
	CreateBitcoinerSocialMediaItem,
	UpdateBitcoinerRequest,
} from '@/types/bitcoiner'

import { useState } from 'react'

import { Loader2, Plus, Share2, Trash2 } from 'lucide-react'

interface BitcoinerFormProps {
	bitcoiner?: Bitcoiner
	onSubmit: (
		data:
			| Omit<UpdateBitcoinerRequest, 'id'>
			| {
					name: string
					bio: string
					socialMedia: CreateBitcoinerSocialMediaItem[]
			  }
	) => void
	onCancel: () => void
	isLoading?: boolean
}

type FormSocialMedia = {
	id?: string
	displayText: string
	platform: string
	urlLink: string
}

type FormData = {
	name: string
	bio: string
	socialMedia: FormSocialMedia[]
}

export const BitcoinerForm: React.FC<BitcoinerFormProps> = ({
	bitcoiner,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const [formData, setFormData] = useState<FormData>({
		name: bitcoiner?.name || '',
		bio: bitcoiner?.bio || '',
		socialMedia:
			bitcoiner?.socialMedia.map((sm) => ({
				id: sm.id,
				displayText: sm.displayText,
				platform: sm.platform,
				urlLink: sm.urlLink,
			})) || [],
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	const addSocialMedia = () => {
		setFormData((prev) => ({
			...prev,
			socialMedia: [
				...prev.socialMedia,
				{
					displayText: '',
					platform: 'facebook',
					urlLink: '',
				},
			],
		}))
	}

	const updateSocialMedia = (
		index: number,
		field: keyof FormSocialMedia,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: prev.socialMedia.map((social, i) =>
				i === index ? { ...social, [field]: value } : social
			),
		}))
	}

	const removeSocialMedia = (index: number) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: prev.socialMedia.filter((_, i) => i !== index),
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Clear previous errors
		setErrors({})

		// Basic validation
		if (!formData.name.trim()) {
			setErrors({ name: 'Name is required' })
			return
		}

		if (!formData.bio.trim()) {
			setErrors({ bio: 'Bio is required' })
			return
		}

		// Validate social media
		const socialMediaErrors: Record<string, string> = {}
		formData.socialMedia.forEach((social, index) => {
			if (!social.displayText.trim()) {
				socialMediaErrors[`social-${index}-displayText`] =
					'Display text is required'
			}
			if (!social.urlLink.trim()) {
				socialMediaErrors[`social-${index}-urlLink`] = 'URL is required'
			} else {
				try {
					new URL(social.urlLink)
				} catch {
					socialMediaErrors[`social-${index}-urlLink`] = 'Invalid URL format'
				}
			}
		})

		if (Object.keys(socialMediaErrors).length > 0) {
			setErrors(socialMediaErrors)
			return
		}

		// Format data for API
		const submitData = {
			name: formData.name.trim(),
			bio: formData.bio.trim(),
			socialMedia: formData.socialMedia.map((social) => ({
				displayText: social.displayText.trim(),
				platform: social.platform,
				urlLink: social.urlLink.trim(),
			})),
		}

		onSubmit(submitData)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Name Field */}
			<div>
				<Label htmlFor="name" className="text-sm font-medium">
					Name *
				</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="Enter bitcoiner name"
					required
					className="mt-1"
				/>
				{errors.name && (
					<p className="text-sm text-destructive mt-1">{errors.name}</p>
				)}
			</div>

			{/* Bio Field */}
			<div>
				<Label htmlFor="bio" className="text-sm font-medium">
					Bio *
				</Label>
				<Textarea
					id="bio"
					value={formData.bio}
					onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
					placeholder="Enter bitcoiner bio"
					required
					className="mt-1 min-h-[100px]"
					rows={4}
				/>
				{errors.bio && (
					<p className="text-sm text-destructive mt-1">{errors.bio}</p>
				)}
			</div>

			{/* Social Media Section */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<Label className="text-sm font-medium">Social Media Links</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addSocialMedia}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Link
					</Button>
				</div>

				<div className="space-y-4">
					{formData.socialMedia.map((social, index) => (
						<Card key={social.id || `temp-${index}`} className="p-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor={`platform-${index}`} className="text-xs">
										Platform *
									</Label>
									<Select
										value={social.platform}
										onValueChange={(value) =>
											updateSocialMedia(index, 'platform', value)
										}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select platform" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="facebook">Facebook</SelectItem>
											<SelectItem value="youtube">YouTube</SelectItem>
											<SelectItem value="twitter">Twitter</SelectItem>
											<SelectItem value="linkedin">LinkedIn</SelectItem>
											<SelectItem value="instagram">Instagram</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor={`displayText-${index}`} className="text-xs">
										Display Text *
									</Label>
									<Input
										id={`displayText-${index}`}
										value={social.displayText}
										onChange={(e) =>
											updateSocialMedia(index, 'displayText', e.target.value)
										}
										placeholder="e.g., เพจ BLC Chiang Mai"
										className="mt-1"
									/>
									{errors[`social-${index}-displayText`] && (
										<p className="text-xs text-destructive mt-1">
											{errors[`social-${index}-displayText`]}
										</p>
									)}
								</div>

								<div className="md:col-span-2 flex items-end gap-2">
									<div className="flex-1">
										<Label htmlFor={`urlLink-${index}`} className="text-xs">
											URL *
										</Label>
										<Input
											id={`urlLink-${index}`}
											value={social.urlLink}
											onChange={(e) =>
												updateSocialMedia(index, 'urlLink', e.target.value)
											}
											placeholder="https://..."
											className="mt-1"
										/>
										{errors[`social-${index}-urlLink`] && (
											<p className="text-xs text-destructive mt-1">
												{errors[`social-${index}-urlLink`]}
											</p>
										)}
									</div>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => removeSocialMedia(index)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</Card>
					))}

					{formData.socialMedia.length === 0 && (
						<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
							<Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
							<p className="text-sm">No social media links added yet</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addSocialMedia}
								className="mt-2"
							>
								Add First Link
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end space-x-4 pt-6 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isLoading || !formData.name.trim() || !formData.bio.trim()}
				>
					{isLoading ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							{bitcoiner ? 'Updating...' : 'Creating...'}
						</>
					) : bitcoiner ? (
						'Update Bitcoiner'
					) : (
						'Create Bitcoiner'
					)}
				</Button>
			</div>
		</form>
	)
}
