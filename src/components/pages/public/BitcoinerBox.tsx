import { Bitcoiner } from '@/types-old/event'
import { cn } from '@/utils/utils'

interface BitcoinerBoxProps {
	bitcoiners: Bitcoiner[]
	className?: string
}

export function BitcoinerBox({ bitcoiners, className }: BitcoinerBoxProps) {
	if (!bitcoiners || bitcoiners.length === 0) return null

	return (
		<div
			className={cn(
				'p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800',
				className
			)}
		>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Speakers
			</h3>
			<div className="flex flex-col gap-2">
				{bitcoiners.map((speaker) => (
					<a
						key={speaker.id}
						href={`/speaker/${speaker.id}`}
						className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
					>
						<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
							{speaker.name}
						</div>
					</a>
				))}
			</div>
		</div>
	)
}
