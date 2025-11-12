import { CurrentUser } from '@/api'

import { NextRequest } from 'next/server'

export abstract class ApiController<TRequest, TResponse> {
	protected user: CurrentUser | null
	protected payload: TRequest

	protected constructor(payload: TRequest, user: CurrentUser | null) {
		this.payload = payload
		this.user = user
	}

	static async fromRequest(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_request: NextRequest
	): Promise<ApiController<unknown, unknown>> {
		throw new Error('fromRequest must be implemented by subclass')
	}

	abstract toResult(): Promise<TResponse>
}
