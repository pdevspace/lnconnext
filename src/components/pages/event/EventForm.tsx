'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useBitcoiners } from '@/hooks/useBitcoiner'
import { useOrganizers } from '@/hooks/useOrganizer'
import {
	CreateEventSectionItem,
	CreateEventWebsiteItem,
	Event,
	UpdateEventRequest,
	WEBSITE_TYPE_OPTIONS,
} from '@/types/event'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { format, parse } from 'date-fns'
import {
	Calendar,
	ExternalLink,
	Globe,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Plus,
	Share2,
	Trash2,
	Users,
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface EventFormProps {
	event?: Event
	onSubmit: (
		data:
			| Omit<UpdateEventRequest, 'id'>
			| {
					name: string
					description: string
					startDate: Date | string
					endDate: Date | string
					price: number | null
					currency: string | null
					images: string[]
					organizerId: string
					location?: {
						buildingName: string
						address: string
						city: string
						googleMapsUrl: string
					}
					websites: CreateEventWebsiteItem[]
					sections: CreateEventSectionItem[]
			  }
	) => void
	onCancel: () => void
	isLoading?: boolean
}

type FormWebsite = {
	id?: string
	url: string
	displayText: string
	type: string
}

type FormSection = {
	id?: string
	sectionName: string
	startTime: string
	endTime: string
	spot: string
	description: string
	participantIds: string[]
}

type FormData = {
	name: string
	description: string
	startDate: string
	startTime: string
	endDate: string
	endTime: string
	price: string
	currency: string
	images: string[]
	organizerId: string
	location: {
		buildingName: string
		address: string
		city: string
		googleMapsUrl: string
	} | null
	websites: FormWebsite[]
	sections: FormSection[]
}

export const EventForm: React.FC<EventFormProps> = ({
	event,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const { organizers, loading: organizersLoading } = useOrganizers()
	const { bitcoiners, loading: bitcoinersLoading } = useBitcoiners()

	const formatDateForInput = (
		date: Date | string | null | undefined
	): string => {
		if (!date) return ''
		const d = date instanceof Date ? date : new Date(date)
		return d.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
	}

	const formatDateForInputDate = (
		date: Date | string | null | undefined
	): string => {
		if (!date) return ''
		const d = date instanceof Date ? date : new Date(date)
		return d.toISOString().slice(0, 10) // Format: YYYY-MM-DD
	}

	const formatTimeForInput = (
		date: Date | string | null | undefined
	): string => {
		if (!date) return ''
		const d = date instanceof Date ? date : new Date(date)
		return d.toTimeString().slice(0, 5) // Format: HH:mm
	}

	// Convert date strings to Date objects for datepicker
	const getDateFromString = (dateStr: string, timeStr: string): Date | null => {
		if (!dateStr) return null
		try {
			if (timeStr) {
				return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date())
			}
			return parse(dateStr, 'yyyy-MM-dd', new Date())
		} catch {
			return null
		}
	}

	// Validate URL format
	const isValidUrl = (urlString: string): boolean => {
		if (!urlString.trim()) return false
		try {
			const url = new URL(urlString)
			return url.protocol === 'http:' || url.protocol === 'https:'
		} catch {
			return false
		}
	}

	const [formData, setFormData] = useState<FormData>({
		name: event?.name || '',
		description: event?.description || '',
		startDate: formatDateForInputDate(event?.startDate),
		startTime: formatTimeForInput(event?.startDate),
		endDate: formatDateForInputDate(event?.endDate),
		endTime: formatTimeForInput(event?.endDate),
		price: event?.price?.toString() || '0',
		currency: event?.currency || 'USD',
		images: event?.images || [],
		organizerId: event?.organizerId || '',
		location: event?.location
			? {
					buildingName: event.location.buildingName,
					address: event.location.address,
					city: event.location.city,
					googleMapsUrl: event.location.googleMapsUrl,
				}
			: null,
		websites:
			event?.websites.map((w) => ({
				id: w.id,
				url: w.url,
				displayText: w.displayText,
				type: w.type,
			})) || [],
		sections:
			event?.sections.map((s) => ({
				id: s.id,
				sectionName: s.sectionName,
				startTime: s.startTime ? formatDateForInput(s.startTime) : '',
				endTime: s.endTime ? formatDateForInput(s.endTime) : '',
				spot: s.spot,
				description: s.description,
				participantIds: s.participants.map((p) => p.bitcoinerId),
			})) || [],
	})

	// State for datepicker Date objects
	const [startDateTime, setStartDateTime] = useState<Date | null>(
		getDateFromString(
			formatDateForInputDate(event?.startDate),
			formatTimeForInput(event?.startDate)
		)
	)
	const [endDateTime, setEndDateTime] = useState<Date | null>(
		getDateFromString(
			formatDateForInputDate(event?.endDate),
			formatTimeForInput(event?.endDate)
		)
	)

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showLocation, setShowLocation] = useState(!!event?.location)

	const selectedOrganizer = organizers.find(
		(org) => org.id === formData.organizerId
	)

	const addImage = () => {
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ''],
		}))
	}

	const updateImage = (index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.map((img, i) => (i === index ? value : img)),
		}))
	}

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}))
	}

	const addWebsite = () => {
		setFormData((prev) => ({
			...prev,
			websites: [
				...prev.websites,
				{
					url: '',
					displayText: '',
					type: 'facebook',
				},
			],
		}))
	}

	const updateWebsite = (
		index: number,
		field: keyof FormWebsite,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			websites: prev.websites.map((website, i) =>
				i === index ? { ...website, [field]: value } : website
			),
		}))
	}

	const removeWebsite = (index: number) => {
		setFormData((prev) => ({
			...prev,
			websites: prev.websites.filter((_, i) => i !== index),
		}))
	}

	const addSection = () => {
		setFormData((prev) => ({
			...prev,
			sections: [
				...prev.sections,
				{
					sectionName: '',
					startTime: '',
					endTime: '',
					spot: '',
					description: '',
					participantIds: [],
				},
			],
		}))
	}

	const updateSection = (
		index: number,
		field: keyof FormSection,
		value: string | string[]
	) => {
		setFormData((prev) => ({
			...prev,
			sections: prev.sections.map((section, i) =>
				i === index ? { ...section, [field]: value } : section
			),
		}))
	}

	const toggleSectionParticipant = (
		sectionIndex: number,
		bitcoinerId: string
	) => {
		setFormData((prev) => ({
			...prev,
			sections: prev.sections.map((section, i) => {
				if (i === sectionIndex) {
					const participantIds = section.participantIds.includes(bitcoinerId)
						? section.participantIds.filter((id) => id !== bitcoinerId)
						: [...section.participantIds, bitcoinerId]
					return { ...section, participantIds }
				}
				return section
			}),
		}))
	}

	const removeSection = (index: number) => {
		setFormData((prev) => ({
			...prev,
			sections: prev.sections.filter((_, i) => i !== index),
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		setErrors({})

		// Validation
		if (!formData.name.trim()) {
			setErrors({ name: 'Name is required' })
			return
		}

		if (!formData.description.trim()) {
			setErrors({ description: 'Description is required' })
			return
		}

		if (!formData.startDate) {
			setErrors({ startDate: 'Start date is required' })
			return
		}

		if (!formData.startTime) {
			setErrors({ startTime: 'Start time is required' })
			return
		}

		const startDateTime = new Date(
			`${formData.startDate}T${formData.startTime}`
		)

		if (
			formData.endDate &&
			formData.endTime &&
			new Date(`${formData.endDate}T${formData.endTime}`) <= startDateTime
		) {
			setErrors({ endDate: 'End date/time must be after start date/time' })
			return
		}

		if (!formData.organizerId) {
			setErrors({ organizerId: 'Organizer is required' })
			return
		}

		const priceStr = formData.price.trim()
		let price = parseFloat(priceStr)

		if (
			priceStr === '' ||
			price === undefined ||
			price === null ||
			isNaN(price) ||
			price <= 0
		) {
			price = 0
		}

		if (
			priceStr !== '' &&
			(isNaN(parseFloat(priceStr)) || parseFloat(priceStr) < 0)
		) {
			price = 0
		}

		const isFree = price === 0

		// Validate websites
		const websiteErrors: Record<string, string> = {}
		formData.websites.forEach((website, index) => {
			if (!website.url.trim()) {
				websiteErrors[`website-${index}-url`] = 'URL is required'
			} else {
				try {
					new URL(website.url)
				} catch {
					websiteErrors[`website-${index}-url`] = 'Invalid URL format'
				}
			}
			if (!website.displayText.trim()) {
				websiteErrors[`website-${index}-displayText`] =
					'Display text is required'
			}
		})

		if (Object.keys(websiteErrors).length > 0) {
			setErrors(websiteErrors)
			return
		}

		// Validate sections
		const sectionErrors: Record<string, string> = {}
		formData.sections.forEach((section, index) => {
			if (!section.sectionName.trim()) {
				sectionErrors[`section-${index}-sectionName`] =
					'Section name is required'
			}
			if (
				section.endTime &&
				section.startTime &&
				section.endTime < section.startTime
			) {
				sectionErrors[`section-${index}-endTime`] =
					'End time must be after start time'
			}
		})

		if (Object.keys(sectionErrors).length > 0) {
			setErrors(sectionErrors)
			return
		}

		// Format data for API
		const submitData = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			startDate: new Date(
				`${formData.startDate}T${formData.startTime}`
			).toISOString(),
			endDate:
				formData.endDate && formData.endTime
					? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
					: null,
			...(isFree
				? { price: 0, currency: '' }
				: { price: price!, currency: formData.currency }),
			images: formData.images.filter((img) => img.trim()),
			organizerId: formData.organizerId,
			...(showLocation &&
				formData.location && {
					location: {
						buildingName: formData.location.buildingName.trim(),
						address: formData.location.address.trim(),
						city: formData.location.city.trim(),
						googleMapsUrl: formData.location.googleMapsUrl.trim(),
					},
				}),
			websites: formData.websites.map((website) => ({
				url: website.url.trim(),
				displayText: website.displayText.trim(),
				type: website.type,
			})),
			sections: formData.sections.map((section) => ({
				sectionName: section.sectionName.trim(),
				startTime: section.startTime
					? new Date(section.startTime).toISOString()
					: null,
				endTime: section.endTime
					? new Date(section.endTime).toISOString()
					: null,
				spot: section.spot.trim(),
				description: section.description.trim(),
				participantIds: section.participantIds,
			})),
		}

		onSubmit(submitData)
	}

	return (
		<div className="max-w-7xl mx-auto">
			<form onSubmit={handleSubmit}>
				{/* Desktop Layout */}
				<div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
					{/* Left Column (30%) */}
					<div className="lg:col-span-4 space-y-6">
						{/* Images */}
						<Card className="aspect-square">
							<CardContent className="h-full overflow-y-auto">
								{/* Square Image Preview Grid */}
								<div className="py-6 flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<ImageIcon className="w-5 h-5" />
										Images
									</CardTitle>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addImage}
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Image URL
									</Button>
								</div>
								{formData.images.length > 0 && (
									<div className="grid grid-cols-2 gap-2 mb-4">
										{formData.images.map((image, index) => (
											<div key={index} className="relative aspect-square group">
												{image.trim() ? (
													<>
														<Image
															src={image}
															alt={`Event image ${index + 1}`}
															fill
															className="object-cover rounded-lg border"
															onError={(e) => {
																const target = e.target as HTMLImageElement
																target.style.display = 'none'
															}}
														/>
														<Button
															type="button"
															variant="destructive"
															size="sm"
															onClick={() => removeImage(index)}
															className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<Trash2 className="w-3 h-3" />
														</Button>
													</>
												) : (
													<div className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
														<ImageIcon className="w-8 h-8 text-muted-foreground" />
													</div>
												)}
											</div>
										))}
									</div>
								)}
								{/* Image URL Inputs */}
								<div className="space-y-2">
									{formData.images.map((image, index) => (
										<div key={index} className="flex gap-2">
											<Input
												value={image}
												onChange={(e) => updateImage(index, e.target.value)}
												placeholder="https://example.com/image.jpg"
												className="flex-1"
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() => removeImage(index)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									))}
									{formData.images.length === 0 && (
										<p className="text-sm text-muted-foreground">
											No images added. Add image URLs to display event images.
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Date and Time */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="w-5 h-5" />
									Date & Time
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label className="text-sm font-medium mb-2 block">
										Start Date & Time *
									</Label>
									<div className="w-full">
										<DatePicker
											selected={startDateTime}
											onChange={(date: Date | null) => {
												setStartDateTime(date)
												if (date) {
													setFormData({
														...formData,
														startDate: format(date, 'yyyy-MM-dd'),
														startTime: format(date, 'HH:mm'),
													})
												}
											}}
											showTimeSelect
											timeIntervals={15}
											dateFormat="MMMM d, yyyy h:mm aa"
											className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											required
											placeholderText="Select start date and time"
											wrapperClassName="w-full"
										/>
									</div>
									{errors.startDate && (
										<p className="text-sm text-destructive mt-1">
											{errors.startDate}
										</p>
									)}
									{errors.startTime && (
										<p className="text-sm text-destructive mt-1">
											{errors.startTime}
										</p>
									)}
								</div>

								<div>
									<Label className="text-sm font-medium mb-2 block">
										End Date & Time
									</Label>
									<div className="w-full">
										<DatePicker
											selected={endDateTime}
											onChange={(date: Date | null) => {
												setEndDateTime(date)
												if (date) {
													setFormData({
														...formData,
														endDate: format(date, 'yyyy-MM-dd'),
														endTime: format(date, 'HH:mm'),
													})
												} else {
													setFormData({
														...formData,
														endDate: '',
														endTime: '',
													})
												}
											}}
											showTimeSelect
											timeIntervals={15}
											dateFormat="MMMM d, yyyy h:mm aa"
											className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											placeholderText="Select end date and time"
											minDate={startDateTime || undefined}
											wrapperClassName="w-full"
											isClearable
										/>
									</div>
									{errors.endDate && (
										<p className="text-sm text-destructive mt-1">
											{errors.endDate}
										</p>
									)}
									{errors.endTime && (
										<p className="text-sm text-destructive mt-1">
											{errors.endTime}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Price and Currency */}
						<Card>
							<CardHeader>
								<CardTitle>Price</CardTitle>
							</CardHeader>
							<CardContent>
								<div>
									<Label htmlFor="price" className="text-sm font-medium">
										Price
									</Label>
									<div className="flex items-center gap-2 mt-1">
										<Input
											id="price"
											type="number"
											step="0.01"
											min="0"
											value={formData.price}
											onChange={(e) => {
												const newPrice = e.target.value
												setFormData({ ...formData, price: newPrice })
											}}
											placeholder="0.00"
											className="w-[120px]"
										/>
										{formData.price !== '' &&
											parseFloat(formData.price) !== 0 && (
												<Input
													id="currency"
													type="text"
													value={formData.currency}
													onChange={(e) =>
														setFormData({
															...formData,
															currency: e.target.value,
														})
													}
													placeholder="USD"
													required
													className="w-[80px]"
												/>
											)}
									</div>
									{errors.price && (
										<p className="text-sm text-destructive mt-1">
											{errors.price}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Websites */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Globe className="w-5 h-5" />
										External Websites
									</CardTitle>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addWebsite}
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Website
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{formData.websites.map((website, index) => (
										<Card key={website.id || `temp-${index}`} className="p-4">
											<div className="grid grid-cols-1 gap-4">
												<div>
													<Label
														htmlFor={`website-type-${index}`}
														className="text-xs"
													>
														Type *
													</Label>
													<Select
														value={website.type}
														onValueChange={(value) =>
															updateWebsite(index, 'type', value)
														}
													>
														<SelectTrigger className="mt-1">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{WEBSITE_TYPE_OPTIONS.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label
														htmlFor={`website-displayText-${index}`}
														className="text-xs"
													>
														Display Text *
													</Label>
													<Input
														id={`website-displayText-${index}`}
														value={website.displayText}
														onChange={(e) =>
															updateWebsite(
																index,
																'displayText',
																e.target.value
															)
														}
														className="mt-1"
													/>
													{errors[`website-${index}-displayText`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`website-${index}-displayText`]}
														</p>
													)}
												</div>
												<div className="flex items-end gap-2">
													<div className="flex-1">
														<Label
															htmlFor={`website-url-${index}`}
															className="text-xs"
														>
															URL *
														</Label>
														<Input
															id={`website-url-${index}`}
															value={website.url}
															onChange={(e) =>
																updateWebsite(index, 'url', e.target.value)
															}
															placeholder="https://..."
															className="mt-1"
														/>
														{errors[`website-${index}-url`] && (
															<p className="text-xs text-destructive mt-1">
																{errors[`website-${index}-url`]}
															</p>
														)}
													</div>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() => removeWebsite(index)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</Card>
									))}
									{formData.websites.length === 0 && (
										<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
											<Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
											<p className="text-sm">No external websites added yet</p>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addWebsite}
												className="mt-2"
											>
												Add First Website
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column (70%) */}
					<div className="lg:col-span-8 space-y-6">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle>Event Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="name" className="text-sm font-medium">
										Event Name *
									</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="Enter event name"
										required
										className="mt-1"
									/>
									{errors.name && (
										<p className="text-sm text-destructive mt-1">
											{errors.name}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="organizer" className="text-sm font-medium">
										Organizer *
									</Label>
									<div className="flex items-start gap-2 mt-1">
										<div className="flex-1">
											<Select
												value={formData.organizerId}
												onValueChange={(value) =>
													setFormData({ ...formData, organizerId: value })
												}
												disabled={organizersLoading}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select an organizer" />
												</SelectTrigger>
												<SelectContent>
													{organizers.map((organizer) => (
														<SelectItem key={organizer.id} value={organizer.id}>
															{organizer.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										{selectedOrganizer ? (
											<Link
												href={`/organizer/${selectedOrganizer.id}`}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="flex-shrink-0"
											>
												<Button
													type="button"
													variant="outline"
													size="icon"
													className="w-10 h-10 hover:bg-muted/50 group"
												>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</Button>
											</Link>
										) : (
											<div
												aria-hidden
												className="w-10 h-10 rounded-md bg-muted opacity-50"
												style={{
													display: 'inline-block',
												}}
											/>
										)}
									</div>
									{errors.organizerId && (
										<p className="text-sm text-destructive mt-1">
											{errors.organizerId}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="description" className="text-sm font-medium">
										Description *
									</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										placeholder="Enter event description"
										required
										className="mt-1 min-h-[100px]"
										rows={4}
									/>
									{errors.description && (
										<p className="text-sm text-destructive mt-1">
											{errors.description}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Location */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<MapPin className="w-5 h-5" />
										Location
									</CardTitle>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setShowLocation(!showLocation)
											if (!showLocation && !formData.location) {
												setFormData({
													...formData,
													location: {
														buildingName: '',
														address: '',
														city: '',
														googleMapsUrl: '',
													},
												})
											}
										}}
									>
										{showLocation ? 'Remove Location' : 'Add Location'}
									</Button>
								</div>
							</CardHeader>
							{showLocation && formData.location && (
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="buildingName" className="text-xs">
											Building Name
										</Label>
										<Input
											id="buildingName"
											value={formData.location.buildingName}
											onChange={(e) =>
												setFormData({
													...formData,
													location: {
														...formData.location!,
														buildingName: e.target.value,
													},
												})
											}
											placeholder="Building name"
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="address" className="text-xs">
											Address
										</Label>
										<Input
											id="address"
											value={formData.location.address}
											onChange={(e) =>
												setFormData({
													...formData,
													location: {
														...formData.location!,
														address: e.target.value,
													},
												})
											}
											placeholder="Street address"
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="city" className="text-xs">
											City
										</Label>
										<Input
											id="city"
											value={formData.location.city}
											onChange={(e) =>
												setFormData({
													...formData,
													location: {
														...formData.location!,
														city: e.target.value,
													},
												})
											}
											placeholder="City"
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="googleMapsUrl" className="text-xs">
											Google Maps URL
										</Label>
										<div className="flex items-start gap-2 mt-1">
											<div className="flex-1">
												<Input
													id="googleMapsUrl"
													value={formData.location.googleMapsUrl}
													onChange={(e) =>
														setFormData({
															...formData,
															location: {
																...formData.location!,
																googleMapsUrl: e.target.value,
															},
														})
													}
													placeholder="https://maps.google.com/..."
													className="w-full"
												/>
											</div>
											{formData.location.googleMapsUrl.trim() &&
											isValidUrl(formData.location.googleMapsUrl) ? (
												<Link
													href={formData.location.googleMapsUrl}
													target="_blank"
													rel="noopener noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="flex-shrink-0"
												>
													<Button
														type="button"
														variant="outline"
														size="icon"
														className="w-10 h-10 hover:bg-muted/50 group"
													>
														<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
													</Button>
												</Link>
											) : (
												<div
													aria-hidden
													className="w-10 h-10 rounded-md bg-muted opacity-50"
													style={{
														display: 'inline-block',
													}}
												/>
											)}
										</div>
									</div>
								</CardContent>
							)}
						</Card>

						{/* Sections */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										Event Sections
									</CardTitle>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addSection}
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Section
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{formData.sections.map((section, index) => (
										<Card key={section.id || `temp-${index}`} className="p-4">
											<div className="space-y-4">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<Label
															htmlFor={`section-name-${index}`}
															className="text-xs"
														>
															Section Name *
														</Label>
														<Input
															id={`section-name-${index}`}
															value={section.sectionName}
															onChange={(e) =>
																updateSection(
																	index,
																	'sectionName',
																	e.target.value
																)
															}
															className="mt-1"
														/>
														{errors[`section-${index}-sectionName`] && (
															<p className="text-xs text-destructive mt-1">
																{errors[`section-${index}-sectionName`]}
															</p>
														)}
													</div>
													<div>
														<Label
															htmlFor={`section-spot-${index}`}
															className="text-xs"
														>
															Spot/Location
														</Label>
														<Input
															id={`section-spot-${index}`}
															value={section.spot}
															onChange={(e) =>
																updateSection(index, 'spot', e.target.value)
															}
															placeholder="Room/Stage name"
															className="mt-1"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<Label
															htmlFor={`section-startTime-${index}`}
															className="text-xs"
														>
															Start Time
														</Label>
														<div className="w-full mt-1">
															<DatePicker
																selected={
																	section.startTime
																		? parse(
																				section.startTime,
																				"yyyy-MM-dd'T'HH:mm",
																				new Date()
																			)
																		: null
																}
																onChange={(date: Date | null) => {
																	updateSection(
																		index,
																		'startTime',
																		date
																			? format(date, "yyyy-MM-dd'T'HH:mm")
																			: ''
																	)
																}}
																showTimeSelect
																timeIntervals={15}
																dateFormat="MMMM d, yyyy h:mm aa"
																className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
																placeholderText="Select start date and time"
																wrapperClassName="w-full"
																isClearable
															/>
														</div>
														{errors[`section-${index}-startTime`] && (
															<p className="text-xs text-destructive mt-1">
																{errors[`section-${index}-startTime`]}
															</p>
														)}
													</div>
													<div>
														<Label
															htmlFor={`section-endTime-${index}`}
															className="text-xs"
														>
															End Time
														</Label>
														<div className="w-full mt-1">
															<DatePicker
																selected={
																	section.endTime
																		? parse(
																				section.endTime,
																				"yyyy-MM-dd'T'HH:mm",
																				new Date()
																			)
																		: null
																}
																onChange={(date: Date | null) => {
																	updateSection(
																		index,
																		'endTime',
																		date
																			? format(date, "yyyy-MM-dd'T'HH:mm")
																			: ''
																	)
																}}
																showTimeSelect
																timeIntervals={15}
																dateFormat="MMMM d, yyyy h:mm aa"
																className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
																isClearable
																placeholderText="Select end date and time"
																wrapperClassName="w-full"
																minDate={
																	section.startTime
																		? parse(
																				section.startTime,
																				"yyyy-MM-dd'T'HH:mm",
																				new Date()
																			)
																		: undefined
																}
															/>
														</div>
														{errors[`section-${index}-endTime`] && (
															<p className="text-xs text-destructive mt-1">
																{errors[`section-${index}-endTime`]}
															</p>
														)}
													</div>
												</div>
												<div>
													<Label
														htmlFor={`section-description-${index}`}
														className="text-xs"
													>
														Description
													</Label>
													<Textarea
														id={`section-description-${index}`}
														value={section.description}
														onChange={(e) =>
															updateSection(
																index,
																'description',
																e.target.value
															)
														}
														placeholder="Section description"
														className="mt-1"
														rows={2}
													/>
												</div>
												<div>
													<Label className="text-xs mb-2 block">
														Participants
													</Label>
													{bitcoinersLoading ? (
														<p className="text-xs text-muted-foreground">
															Loading participants...
														</p>
													) : bitcoiners.length === 0 ? (
														<p className="text-xs text-muted-foreground">
															No bitcoiners available
														</p>
													) : (
														<div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
															{bitcoiners.map((bitcoiner) => (
																<label
																	key={bitcoiner.id}
																	className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted/50 p-1 rounded"
																>
																	<input
																		type="checkbox"
																		checked={section.participantIds.includes(
																			bitcoiner.id
																		)}
																		onChange={() =>
																			toggleSectionParticipant(
																				index,
																				bitcoiner.id
																			)
																		}
																		className="rounded"
																	/>
																	<span className="truncate">
																		{bitcoiner.name}
																	</span>
																</label>
															))}
														</div>
													)}
												</div>
												<div className="flex justify-end">
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() => removeSection(index)}
													>
														<Trash2 className="w-4 h-4 mr-2" />
														Remove Section
													</Button>
												</div>
											</div>
										</Card>
									))}
									{formData.sections.length === 0 && (
										<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
											<Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
											<p className="text-sm">No event sections added yet</p>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addSection}
												className="mt-2"
											>
												Add First Section
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

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
								disabled={
									isLoading ||
									!formData.name.trim() ||
									!formData.description.trim() ||
									!formData.organizerId
								}
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{event ? 'Updating...' : 'Creating...'}
									</>
								) : event ? (
									'Update Event'
								) : (
									'Create Event'
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile Layout */}
				<div className="lg:hidden space-y-6">
					{/* Images */}
					<Card className="aspect-square">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<ImageIcon className="w-5 h-5" />
									Images
								</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addImage}
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Image URL
								</Button>
							</div>
						</CardHeader>
						<CardContent className="h-full overflow-y-auto">
							{/* Square Image Preview Grid */}
							{formData.images.length > 0 && (
								<div className="grid grid-cols-2 gap-2 mb-4">
									{formData.images.map((image, index) => (
										<div key={index} className="relative aspect-square group">
											{image.trim() ? (
												<>
													<Image
														src={image}
														alt={`Event image ${index + 1}`}
														fill
														className="object-cover rounded-lg border"
														onError={(e) => {
															const target = e.target as HTMLImageElement
															target.style.display = 'none'
														}}
													/>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() => removeImage(index)}
														className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<Trash2 className="w-3 h-3" />
													</Button>
												</>
											) : (
												<div className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
													<ImageIcon className="w-8 h-8 text-muted-foreground" />
												</div>
											)}
										</div>
									))}
								</div>
							)}
							{/* Image URL Inputs */}
							<div className="space-y-2">
								{formData.images.map((image, index) => (
									<div key={index} className="flex gap-2">
										<Input
											value={image}
											onChange={(e) => updateImage(index, e.target.value)}
											placeholder="https://example.com/image.jpg"
											className="flex-1"
										/>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											onClick={() => removeImage(index)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))}
								{formData.images.length === 0 && (
									<p className="text-sm text-muted-foreground">
										No images added. Add image URLs to display event images.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Event Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="name-mobile" className="text-sm font-medium">
									Event Name *
								</Label>
								<Input
									id="name-mobile"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Enter event name"
									required
									className="mt-1"
								/>
								{errors.name && (
									<p className="text-sm text-destructive mt-1">{errors.name}</p>
								)}
							</div>

							<div>
								<Label
									htmlFor="description-mobile"
									className="text-sm font-medium"
								>
									Description *
								</Label>
								<Textarea
									id="description-mobile"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder="Enter event description"
									required
									className="mt-1 min-h-[100px]"
									rows={4}
								/>
								{errors.description && (
									<p className="text-sm text-destructive mt-1">
										{errors.description}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Price and Currency */}
					<Card>
						<CardHeader>
							<CardTitle>Price</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<Label htmlFor="price-mobile" className="text-sm font-medium">
									Price
								</Label>
								<div className="flex items-center gap-2 mt-1">
									<Input
										id="price-mobile"
										type="number"
										step="0.01"
										min="0"
										value={formData.price}
										onChange={(e) => {
											const newPrice = e.target.value
											setFormData({ ...formData, price: newPrice })
										}}
										placeholder="0.00"
										className="w-[120px]"
									/>
									{formData.price !== '' &&
										parseFloat(formData.price) !== 0 && (
											<Input
												id="currency-mobile"
												type="text"
												value={formData.currency}
												onChange={(e) =>
													setFormData({ ...formData, currency: e.target.value })
												}
												placeholder="USD"
												required
												className="w-[80px]"
											/>
										)}
								</div>
								{errors.price && (
									<p className="text-sm text-destructive mt-1">
										{errors.price}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Organizer */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5" />
								Organizer
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<Label
									htmlFor="organizer-mobile"
									className="text-sm font-medium"
								>
									Organizer *
								</Label>
								<div className="flex items-start gap-2 mt-1">
									<div className="flex-1">
										<Select
											value={formData.organizerId}
											onValueChange={(value) =>
												setFormData({ ...formData, organizerId: value })
											}
											disabled={organizersLoading}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select an organizer" />
											</SelectTrigger>
											<SelectContent>
												{organizers.map((organizer) => (
													<SelectItem key={organizer.id} value={organizer.id}>
														{organizer.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{selectedOrganizer && (
										<Link
											href={`/organizer/${selectedOrganizer.id}`}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex-shrink-0"
										>
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="w-10 h-10 hover:bg-muted/50 group"
											>
												<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
											</Button>
										</Link>
									)}
								</div>
								{errors.organizerId && (
									<p className="text-sm text-destructive mt-1">
										{errors.organizerId}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Date and Time */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="w-5 h-5" />
								Date & Time
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label className="text-sm font-medium mb-2 block">
									Start Date & Time *
								</Label>
								<div className="w-full">
									<DatePicker
										selected={startDateTime}
										onChange={(date: Date | null) => {
											setStartDateTime(date)
											if (date) {
												setFormData({
													...formData,
													startDate: format(date, 'yyyy-MM-dd'),
													startTime: format(date, 'HH:mm'),
												})
											}
										}}
										showTimeSelect
										timeIntervals={15}
										dateFormat="MMMM d, yyyy h:mm aa"
										className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										required
										placeholderText="Select start date and time"
										wrapperClassName="w-full"
									/>
								</div>
								{errors.startDate && (
									<p className="text-sm text-destructive mt-1">
										{errors.startDate}
									</p>
								)}
								{errors.startTime && (
									<p className="text-sm text-destructive mt-1">
										{errors.startTime}
									</p>
								)}
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">
									End Date & Time
								</Label>
								<div className="w-full">
									<DatePicker
										selected={endDateTime}
										onChange={(date: Date | null) => {
											setEndDateTime(date)
											if (date) {
												setFormData({
													...formData,
													endDate: format(date, 'yyyy-MM-dd'),
													endTime: format(date, 'HH:mm'),
												})
											} else {
												setFormData({
													...formData,
													endDate: '',
													endTime: '',
												})
											}
										}}
										showTimeSelect
										timeIntervals={15}
										dateFormat="MMMM d, yyyy h:mm aa"
										className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										isClearable
										placeholderText="Select end date and time"
										minDate={startDateTime || undefined}
										wrapperClassName="w-full"
									/>
								</div>
								{errors.endDate && (
									<p className="text-sm text-destructive mt-1">
										{errors.endDate}
									</p>
								)}
								{errors.endTime && (
									<p className="text-sm text-destructive mt-1">
										{errors.endTime}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Websites */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<Globe className="w-5 h-5" />
									External Websites
								</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addWebsite}
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Website
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{formData.websites.map((website, index) => (
									<Card key={website.id || `temp-${index}`} className="p-4">
										<div className="grid grid-cols-1 gap-4">
											<div>
												<Label
													htmlFor={`website-type-mobile-${index}`}
													className="text-xs"
												>
													Type *
												</Label>
												<Select
													value={website.type}
													onValueChange={(value) =>
														updateWebsite(index, 'type', value)
													}
												>
													<SelectTrigger className="mt-1">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{WEBSITE_TYPE_OPTIONS.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label
													htmlFor={`website-displayText-mobile-${index}`}
													className="text-xs"
												>
													Display Text *
												</Label>
												<Input
													id={`website-displayText-mobile-${index}`}
													value={website.displayText}
													onChange={(e) =>
														updateWebsite(index, 'displayText', e.target.value)
													}
													className="mt-1"
												/>
												{errors[`website-${index}-displayText`] && (
													<p className="text-xs text-destructive mt-1">
														{errors[`website-${index}-displayText`]}
													</p>
												)}
											</div>
											<div className="flex items-end gap-2">
												<div className="flex-1">
													<Label
														htmlFor={`website-url-mobile-${index}`}
														className="text-xs"
													>
														URL *
													</Label>
													<Input
														id={`website-url-mobile-${index}`}
														value={website.url}
														onChange={(e) =>
															updateWebsite(index, 'url', e.target.value)
														}
														placeholder="https://..."
														className="mt-1"
													/>
													{errors[`website-${index}-url`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`website-${index}-url`]}
														</p>
													)}
												</div>
												<Button
													type="button"
													variant="destructive"
													size="sm"
													onClick={() => removeWebsite(index)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</Card>
								))}
								{formData.websites.length === 0 && (
									<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
										<Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No external websites added yet</p>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={addWebsite}
											className="mt-2"
										>
											Add First Website
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Location */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<MapPin className="w-5 h-5" />
									Location
								</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowLocation(!showLocation)
										if (!showLocation && !formData.location) {
											setFormData({
												...formData,
												location: {
													buildingName: '',
													address: '',
													city: '',
													googleMapsUrl: '',
												},
											})
										}
									}}
								>
									{showLocation ? 'Remove Location' : 'Add Location'}
								</Button>
							</div>
						</CardHeader>
						{showLocation && formData.location && (
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="buildingName-mobile" className="text-xs">
										Building Name
									</Label>
									<Input
										id="buildingName-mobile"
										value={formData.location.buildingName}
										onChange={(e) =>
											setFormData({
												...formData,
												location: {
													...formData.location!,
													buildingName: e.target.value,
												},
											})
										}
										placeholder="Building name"
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="address-mobile" className="text-xs">
										Address
									</Label>
									<Input
										id="address-mobile"
										value={formData.location.address}
										onChange={(e) =>
											setFormData({
												...formData,
												location: {
													...formData.location!,
													address: e.target.value,
												},
											})
										}
										placeholder="Street address"
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="city-mobile" className="text-xs">
										City
									</Label>
									<Input
										id="city-mobile"
										value={formData.location.city}
										onChange={(e) =>
											setFormData({
												...formData,
												location: {
													...formData.location!,
													city: e.target.value,
												},
											})
										}
										placeholder="City"
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="googleMapsUrl-mobile" className="text-xs">
										Google Maps URL
									</Label>
									<div className="flex items-start gap-2 mt-1">
										<div className="flex-1">
											<Input
												id="googleMapsUrl-mobile"
												value={formData.location.googleMapsUrl}
												onChange={(e) =>
													setFormData({
														...formData,
														location: {
															...formData.location!,
															googleMapsUrl: e.target.value,
														},
													})
												}
												placeholder="https://maps.google.com/..."
												className="w-full"
											/>
										</div>
										{formData.location.googleMapsUrl.trim() &&
										isValidUrl(formData.location.googleMapsUrl) ? (
											<Link
												href={formData.location.googleMapsUrl}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="flex-shrink-0"
											>
												<Button
													type="button"
													variant="outline"
													size="icon"
													className="w-10 h-10 hover:bg-muted/50 group"
												>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</Button>
											</Link>
										) : (
											<div
												aria-hidden
												className="w-10 h-10 rounded-md bg-muted opacity-50"
												style={{
													display: 'inline-block',
												}}
											/>
										)}
									</div>
								</div>
							</CardContent>
						)}
					</Card>

					{/* Websites */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<Globe className="w-5 h-5" />
									External Websites
								</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addWebsite}
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Website
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{formData.websites.map((website, index) => (
									<Card key={website.id || `temp-${index}`} className="p-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label
													htmlFor={`website-type-mobile-${index}`}
													className="text-xs"
												>
													Type *
												</Label>
												<Select
													value={website.type}
													onValueChange={(value) =>
														updateWebsite(index, 'type', value)
													}
												>
													<SelectTrigger className="mt-1">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{WEBSITE_TYPE_OPTIONS.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label
													htmlFor={`website-displayText-mobile-${index}`}
													className="text-xs"
												>
													Display Text *
												</Label>
												<Input
													id={`website-displayText-mobile-${index}`}
													value={website.displayText}
													onChange={(e) =>
														updateWebsite(index, 'displayText', e.target.value)
													}
													className="mt-1"
												/>
												{errors[`website-${index}-displayText`] && (
													<p className="text-xs text-destructive mt-1">
														{errors[`website-${index}-displayText`]}
													</p>
												)}
											</div>
											<div className="md:col-span-2 flex items-end gap-2">
												<div className="flex-1">
													<Label
														htmlFor={`website-url-mobile-${index}`}
														className="text-xs"
													>
														URL *
													</Label>
													<Input
														id={`website-url-mobile-${index}`}
														value={website.url}
														onChange={(e) =>
															updateWebsite(index, 'url', e.target.value)
														}
														placeholder="https://..."
														className="mt-1"
													/>
													{errors[`website-${index}-url`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`website-${index}-url`]}
														</p>
													)}
												</div>
												<Button
													type="button"
													variant="destructive"
													size="sm"
													onClick={() => removeWebsite(index)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</Card>
								))}
								{formData.websites.length === 0 && (
									<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
										<Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No external websites added yet</p>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={addWebsite}
											className="mt-2"
										>
											Add First Website
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Sections */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<Calendar className="w-5 h-5" />
									Event Sections
								</CardTitle>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addSection}
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Section
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{formData.sections.map((section, index) => (
									<Card key={section.id || `temp-${index}`} className="p-4">
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label
														htmlFor={`section-name-mobile-${index}`}
														className="text-xs"
													>
														Section Name *
													</Label>
													<Input
														id={`section-name-mobile-${index}`}
														value={section.sectionName}
														onChange={(e) =>
															updateSection(
																index,
																'sectionName',
																e.target.value
															)
														}
														className="mt-1"
													/>
													{errors[`section-${index}-sectionName`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`section-${index}-sectionName`]}
														</p>
													)}
												</div>
												<div>
													<Label
														htmlFor={`section-spot-mobile-${index}`}
														className="text-xs"
													>
														Spot/Location
													</Label>
													<Input
														id={`section-spot-mobile-${index}`}
														value={section.spot}
														onChange={(e) =>
															updateSection(index, 'spot', e.target.value)
														}
														placeholder="Room/Stage name"
														className="mt-1"
													/>
												</div>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label
														htmlFor={`section-startTime-mobile-${index}`}
														className="text-xs"
													>
														Start Time
													</Label>
													<div className="w-full mt-1">
														<DatePicker
															selected={
																section.startTime
																	? parse(
																			section.startTime,
																			"yyyy-MM-dd'T'HH:mm",
																			new Date()
																		)
																	: null
															}
															onChange={(date: Date | null) => {
																updateSection(
																	index,
																	'startTime',
																	date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''
																)
															}}
															showTimeSelect
															timeIntervals={15}
															dateFormat="MMMM d, yyyy h:mm aa"
															className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															placeholderText="Select start date and time"
															wrapperClassName="w-full"
															isClearable
														/>
													</div>
													{errors[`section-${index}-startTime`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`section-${index}-startTime`]}
														</p>
													)}
												</div>
												<div>
													<Label
														htmlFor={`section-endTime-mobile-${index}`}
														className="text-xs"
													>
														End Time
													</Label>
													<div className="w-full mt-1">
														<DatePicker
															selected={
																section.endTime
																	? parse(
																			section.endTime,
																			"yyyy-MM-dd'T'HH:mm",
																			new Date()
																		)
																	: null
															}
															onChange={(date: Date | null) => {
																updateSection(
																	index,
																	'endTime',
																	date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''
																)
															}}
															showTimeSelect
															timeIntervals={15}
															dateFormat="MMMM d, yyyy h:mm aa"
															className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															isClearable
															placeholderText="Select end date and time"
															wrapperClassName="w-full"
															minDate={
																section.startTime
																	? parse(
																			section.startTime,
																			"yyyy-MM-dd'T'HH:mm",
																			new Date()
																		)
																	: undefined
															}
														/>
													</div>
													{errors[`section-${index}-endTime`] && (
														<p className="text-xs text-destructive mt-1">
															{errors[`section-${index}-endTime`]}
														</p>
													)}
												</div>
											</div>
											<div>
												<Label
													htmlFor={`section-description-mobile-${index}`}
													className="text-xs"
												>
													Description
												</Label>
												<Textarea
													id={`section-description-mobile-${index}`}
													value={section.description}
													onChange={(e) =>
														updateSection(index, 'description', e.target.value)
													}
													placeholder="Section description"
													className="mt-1"
													rows={2}
												/>
											</div>
											<div>
												<Label className="text-xs mb-2 block">
													Participants
												</Label>
												{bitcoinersLoading ? (
													<p className="text-xs text-muted-foreground">
														Loading participants...
													</p>
												) : bitcoiners.length === 0 ? (
													<p className="text-xs text-muted-foreground">
														No bitcoiners available
													</p>
												) : (
													<div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
														{bitcoiners.map((bitcoiner) => (
															<label
																key={bitcoiner.id}
																className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted/50 p-1 rounded"
															>
																<input
																	type="checkbox"
																	checked={section.participantIds.includes(
																		bitcoiner.id
																	)}
																	onChange={() =>
																		toggleSectionParticipant(
																			index,
																			bitcoiner.id
																		)
																	}
																	className="rounded"
																/>
																<span className="truncate">
																	{bitcoiner.name}
																</span>
															</label>
														))}
													</div>
												)}
											</div>
											<div className="flex justify-end">
												<Button
													type="button"
													variant="destructive"
													size="sm"
													onClick={() => removeSection(index)}
												>
													<Trash2 className="w-4 h-4 mr-2" />
													Remove Section
												</Button>
											</div>
										</div>
									</Card>
								))}
								{formData.sections.length === 0 && (
									<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
										<Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No event sections added yet</p>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={addSection}
											className="mt-2"
										>
											Add First Section
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

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
							disabled={
								isLoading ||
								!formData.name.trim() ||
								!formData.description.trim() ||
								!formData.organizerId
							}
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{event ? 'Updating...' : 'Creating...'}
								</>
							) : event ? (
								'Update Event'
							) : (
								'Create Event'
							)}
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
