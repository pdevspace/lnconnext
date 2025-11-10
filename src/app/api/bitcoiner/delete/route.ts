import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { DeleteBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// DeleteBitcoiner
	console.log('/api/bitcoiner/delete')
	try {
		const handler = await DeleteBitcoiner.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
