'use client'

import { useAuth } from '@/utils/AuthContext'
import { useTheme } from '@/utils/ThemeContext'

import { useState } from 'react'

import Link from 'next/link'

import {
	Building2,
	Info,
	LogIn,
	LogOut,
	Monitor,
	Moon,
	Sun,
	User,
	Users,
} from 'lucide-react'

export default function Navbar() {
	const { theme, setTheme, resolvedTheme } = useTheme()
	const { user, loading: authLoading, login, logout } = useAuth()
	const [loginError, setLoginError] = useState<string | null>(null)

	const handleLogin = async () => {
		try {
			setLoginError(null)
			await login()
		} catch (error) {
			setLoginError(error instanceof Error ? error.message : 'Login failed')
		}
	}

	const toggleTheme = () => {
		if (theme === 'light') {
			setTheme('dark')
		} else if (theme === 'dark') {
			setTheme('system')
		} else {
			setTheme('light')
		}
	}

	const getThemeIcon = () => {
		if (theme === 'system') {
			return <Monitor className="h-4 w-4" />
		}
		return resolvedTheme === 'dark' ? (
			<Moon className="h-4 w-4" />
		) : (
			<Sun className="h-4 w-4" />
		)
	}

	return (
		<nav className="fixed h-[70px] top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
			<div className="max-w-7xl h-16 mx-auto px-4 flex items-center justify-between">
				<div className="flex items-center gap-2 md:gap-8 w-full min-w-0">
					<Link href="/" className="flex-shrink-0">
						<span className="text-lg md:text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 cursor-pointer">
							LNConnext
						</span>
					</Link>
					<div className="flex gap-1 md:gap-2 flex-shrink-0">
						<Link href="/event">
							<button
								className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
								title="Event"
							>
								<Users className="h-4 w-4" />
								<span className="hidden sm:inline">Event</span>
							</button>
						</Link>
						<Link href="/organizer">
							<button
								className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
								title="Organizers"
							>
								<Building2 className="h-4 w-4" />
								<span className="hidden sm:inline">Organizers</span>
							</button>
						</Link>
						<Link href="/bitcoiner">
							<button
								className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
								title="Bitcoiners"
							>
								<User className="h-4 w-4" />
								<span className="hidden sm:inline">Bitcoiners</span>
							</button>
						</Link>
					</div>
					<div className="flex-1 min-w-0" />
					<div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
						{user ? (
							<>
								{user.email && (
									<span className="hidden md:inline text-sm text-gray-700 dark:text-gray-300 px-2 truncate max-w-[120px]">
										{user.email.split('@')[0]}
									</span>
								)}
								<button
									onClick={logout}
									className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
									title="Logout"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden sm:inline">Logout</span>
								</button>
							</>
						) : (
							<div className="flex flex-col items-end">
								<button
									onClick={handleLogin}
									disabled={authLoading}
									className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
									title="Login with Google"
								>
									<LogIn className="h-4 w-4" />
									<span className="hidden sm:inline">Login</span>
								</button>
								{loginError && (
									<span className="text-xs text-red-500 mt-1 max-w-[150px] md:max-w-[200px] text-right truncate">
										{loginError}
									</span>
								)}
							</div>
						)}
						<button
							onClick={toggleTheme}
							className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
							title={`Current theme: ${theme} (${resolvedTheme})`}
						>
							{getThemeIcon()}
						</button>
						<Link href="/info">
							<button className="flex items-center gap-1 px-2 md:px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
								<Info className="h-5 w-5" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
