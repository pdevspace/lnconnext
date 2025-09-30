/**
 * Get Event API Endpoint
 * POST /api/event/get
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

    const { eventId } = body;

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Event ID is required'
        },
        { status: 400 }
      );
    }

    // Get event
    const event = await EventService.getEventById(eventId);

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error in get event API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
