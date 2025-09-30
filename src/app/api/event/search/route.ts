/**
 * Search Events API Endpoint
 * POST /api/event/search
 */

import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/services/EventService';
import { validateApiRequest } from '@/utils/backendValidators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateApiRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const { query, filters = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required'
        },
        { status: 400 }
      );
    }

    // Search events
    const events = await EventService.searchEvents(query, filters);

    return NextResponse.json({
      success: true,
      data: events,
      query,
      pagination: {
        total: events.length,
        page: 1,
        limit: filters.limit || 50,
        hasMore: events.length === (filters.limit || 50)
      }
    });

  } catch (error) {
    console.error('Error in search events API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
