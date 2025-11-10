import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { GetBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// GetBitcoiner
	console.log('/api/bitcoiner/get')
	try {
		const handler = await GetBitcoiner.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
