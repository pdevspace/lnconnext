import { handleError } from '@/api/errors'

import { NextRequest, NextResponse } from 'next/server'

import { GetUser } from './service'

export async function POST(request: NextRequest) {
	// GetUser
	// console.log('/api/user/get')
	try {
		const controller = await GetUser.fromRequest(request)

		const result = await controller.toResult()

		return NextResponse.json({ success: true, data: result })
	} catch (error) {
		return handleError(error)
	}
}
