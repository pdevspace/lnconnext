import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/utils/AuthContext'
import { ThemeProvider } from '@/utils/ThemeContext'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Bitcoin Event Tracker - LNConnext',
	description:
		'Discover Bitcoin events happening this weekend. Track meetups, conferences, and more.',
	openGraph: {
		type: 'website',
		url: 'https://lnconnext.vercel.app/',
		title: 'Bitcoin Event Tracker - LNConnext',
		description:
			'Discover Bitcoin events happening this weekend. Track meetups, conferences, and more.',
		images: [
			{
				url: 'https://lnconnext.vercel.app/your-social-preview-image.png',
				width: 1200,
				height: 630,
				alt: 'Bitcoin Event Tracker - LNConnext',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Bitcoin Event Tracker - LNConnext',
		description:
			'Discover Bitcoin events happening this weekend. Track meetups, conferences, and more.',
		images: ['https://lnconnext.vercel.app/your-social-preview-image.png'],
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider>
					<AuthProvider>
						<ToastProvider>
							<Navbar />
							{children}
						</ToastProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
