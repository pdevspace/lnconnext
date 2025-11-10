'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
	resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('dark')
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

	useEffect(() => {
		// Get theme from localStorage or default to system
		const savedTheme = localStorage.getItem('theme') as Theme
		if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
			setTheme(savedTheme)
		}
	}, [])

	useEffect(() => {
		const root = window.document.documentElement

		// Remove previous theme classes
		root.classList.remove('light', 'dark')

		let resolved: 'light' | 'dark'

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light'
			resolved = systemTheme
		} else {
			resolved = theme
		}

		setResolvedTheme(resolved)
		root.classList.add(resolved)

		// Save theme preference
		localStorage.setItem('theme', theme)
	}, [theme])

	useEffect(() => {
		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = () => {
			if (theme === 'system') {
				const systemTheme = mediaQuery.matches ? 'dark' : 'light'
				setResolvedTheme(systemTheme)
				document.documentElement.classList.remove('light', 'dark')
				document.documentElement.classList.add(systemTheme)
			}
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
