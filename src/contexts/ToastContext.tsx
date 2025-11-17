'use client'

import { Toast, ToastComponent } from '@/components/ui/toast'

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'

interface ToastContextType {
	showToast: (message: string, type?: 'error' | 'success' | 'info') => void
	showError: (message: string) => void
	showSuccess: (message: string) => void
	showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([])

	const showToast = useCallback(
		(message: string, type: 'error' | 'success' | 'info' = 'error') => {
			const id = Math.random().toString(36).substring(7)
			setToasts((prev) => [...prev, { id, message, type }])
		},
		[]
	)

	const showError = useCallback(
		(message: string) => showToast(message, 'error'),
		[showToast]
	)

	const showSuccess = useCallback(
		(message: string) => showToast(message, 'success'),
		[showToast]
	)

	const showInfo = useCallback(
		(message: string) => showToast(message, 'info'),
		[showToast]
	)

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id))
	}, [])

	return (
		<ToastContext.Provider
			value={{ showToast, showError, showSuccess, showInfo }}
		>
			{children}
			{/* Toast Container - Fixed top right */}
			<div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
				{toasts.map((toast) => (
					<div key={toast.id} className="pointer-events-auto">
						<ToastComponent toast={toast} onClose={removeToast} />
					</div>
				))}
			</div>
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
