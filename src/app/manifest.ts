import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Bitcoin Events & Community',
		short_name: 'Bitcoin Events',
		description:
			'Discover Bitcoin community events, organizers, and connect with fellow Bitcoiners',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#f7931a',
		icons: [
			{
				src: '/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		categories: ['social', 'business', 'productivity'],
		lang: 'en',
		orientation: 'portrait',
	}
}
