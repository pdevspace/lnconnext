'use client'

import React, { useEffect } from 'react'

import { X } from 'lucide-react'

import { Button } from './button'

export interface Toast {
	id: string
	message: string
	type: 'error' | 'success' | 'info'
}

interface ToastProps {
	toast: Toast
	onClose: (id: string) => void
}

export function ToastComponent({ toast, onClose }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(toast.id)
		}, 5000) // Auto-close after 5 seconds

		return () => clearTimeout(timer)
	}, [toast.id, onClose])

	const bgColor =
		toast.type === 'error'
			? 'bg-destructive'
			: toast.type === 'success'
				? 'bg-green-600'
				: 'bg-blue-600'

	return (
		<div
			className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 min-w-[300px] max-w-[500px] animate-in slide-in-from-top-5`}
		>
			<p className="flex-1 text-sm font-medium">{toast.message}</p>
			<Button
				variant="ghost"
				size="icon"
				className="h-6 w-6 text-white hover:bg-white/20"
				onClick={() => onClose(toast.id)}
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	)
}
