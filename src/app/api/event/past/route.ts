/**
 * Get Past Events API Endpoint
 * POST /api/event/past
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

    const { limit = 10 } = body;

    // Get past events
    const events = await EventService.getPastEvents(limit);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        total: events.length,
        limit
      }
    });

  } catch (error) {
    console.error('Error in get past events API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
