import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/utils/AuthContext'
import { ThemeProvider } from '@/utils/ThemeContext'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Event Tracker',
	description: 'Discover and track events for weekend warriors',
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
