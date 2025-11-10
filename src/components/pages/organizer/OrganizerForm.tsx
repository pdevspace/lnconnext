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
	Organizer,
	OrganizerFormData,
	SocialMedia,
} from '@/types-old/organizer'
import {
	sanitizeText,
	sanitizeUrl,
	validateOrganizerForm,
} from '@/utils/frontendValidators'

import { useState } from 'react'

import { Loader2, Plus, Share2, Trash2 } from 'lucide-react'

interface OrganizerFormProps {
	initialData?: OrganizerFormData
	onSubmit: (data: OrganizerFormData) => void
	onCancel: () => void
	isSubmitting?: boolean
	submitLabel?: string
}

export const OrganizerForm: React.FC<OrganizerFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	isSubmitting = false,
	submitLabel = 'Create Organizer',
}) => {
	const [formData, setFormData] = useState<OrganizerFormData>({
		name: initialData?.name || '',
		bio: initialData?.bio || '',
		avatar: initialData?.avatar || '',
		website: initialData?.website || '',
		isActive: initialData?.isActive ?? true,
		socialMediaIds: initialData?.socialMediaIds || [],
	})

	const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
	const [errors, setErrors] = useState<Record<string, string>>({})

	const addSocialMedia = () => {
		setSocialMedia((prev) => [
			...prev,
			{
				id: `temp-${Date.now()}`,
				displayText: '',
				username: '',
				platform: 'facebook',
				urlLink: '',
				ownerId: '',
				ownerType: 'organizer' as const,
			},
		])
	}

	const updateSocialMedia = (
		index: number,
		field: keyof SocialMedia,
		value: string
	) => {
		setSocialMedia((prev) =>
			prev.map((social, i) =>
				i === index ? { ...social, [field]: value } : social
			)
		)
	}

	const removeSocialMedia = (index: number) => {
		setSocialMedia((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		const validationErrors = validateOrganizerForm(formData)
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}

		// Clear errors
		setErrors({})

		// Submit form
		onSubmit({
			...formData,
			socialMediaIds: socialMedia.map((sm) => sm.id),
		})
	}

	const handleInputChange = (
		field: keyof OrganizerFormData,
		value: string | boolean
	) => {
		setFormData((prev: OrganizerFormData) => ({
			...prev,
			[field]: value,
		}))

		// Clear error when user starts typing
		if (errors[field as string]) {
			setErrors((prev: Record<string, string>) => ({
				...prev,
				[field as string]: '',
			}))
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Basic Information */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Basic Information</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								handleInputChange('name', sanitizeText(e.target.value))
							}
							placeholder="Enter organizer name"
							className={errors.name ? 'border-red-500' : ''}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="website">Website</Label>
						<Input
							id="website"
							value={formData.website}
							onChange={(e) =>
								handleInputChange('website', sanitizeUrl(e.target.value))
							}
							placeholder="https://example.com"
							className={errors.website ? 'border-red-500' : ''}
						/>
						{errors.website && (
							<p className="text-sm text-red-500">{errors.website}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						value={formData.bio}
						onChange={(e) =>
							handleInputChange('bio', sanitizeText(e.target.value))
						}
						placeholder="Tell us about this organizer..."
						rows={3}
						className={errors.bio ? 'border-red-500' : ''}
					/>
					{errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor="avatar">Avatar URL</Label>
					<Input
						id="avatar"
						value={formData.avatar}
						onChange={(e) =>
							handleInputChange('avatar', sanitizeUrl(e.target.value))
						}
						placeholder="https://example.com/avatar.jpg"
						className={errors.avatar ? 'border-red-500' : ''}
					/>
					{errors.avatar && (
						<p className="text-sm text-red-500">{errors.avatar}</p>
					)}
				</div>

				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						id="isActive"
						checked={formData.isActive}
						onChange={(e) => handleInputChange('isActive', e.target.checked)}
						className="rounded"
					/>
					<Label htmlFor="isActive">Active organizer</Label>
				</div>
			</div>

			{/* Social Media */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Social Media</h3>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addSocialMedia}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Social Media
					</Button>
				</div>

				{socialMedia.length === 0 ? (
					<Card className="p-6 text-center">
						<Share2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
						<p className="text-muted-foreground">
							No social media links added yet
						</p>
					</Card>
				) : (
					<div className="space-y-4">
						{socialMedia.map((social, index) => (
							<Card key={social.id} className="p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Platform</Label>
										<Select
											value={social.platform}
											onValueChange={(value) =>
												updateSocialMedia(index, 'platform', value)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="facebook">Facebook</SelectItem>
												<SelectItem value="twitter">Twitter</SelectItem>
												<SelectItem value="linkedin">LinkedIn</SelectItem>
												<SelectItem value="instagram">Instagram</SelectItem>
												<SelectItem value="youtube">YouTube</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Username</Label>
										<Input
											value={social.username}
											onChange={(e) =>
												updateSocialMedia(
													index,
													'username',
													sanitizeText(e.target.value)
												)
											}
											placeholder="@username"
										/>
									</div>

									<div className="space-y-2">
										<Label>Display Text</Label>
										<Input
											value={social.displayText}
											onChange={(e) =>
												updateSocialMedia(
													index,
													'displayText',
													sanitizeText(e.target.value)
												)
											}
											placeholder="Display name"
										/>
									</div>

									<div className="space-y-2">
										<Label>URL</Label>
										<Input
											value={social.urlLink}
											onChange={(e) =>
												updateSocialMedia(
													index,
													'urlLink',
													sanitizeUrl(e.target.value)
												)
											}
											placeholder="https://..."
										/>
									</div>
								</div>

								<div className="flex justify-end mt-4">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => removeSocialMedia(index)}
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Remove
									</Button>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Form Actions */}
			<div className="flex justify-end space-x-4 pt-6 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							Processing...
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	)
}
