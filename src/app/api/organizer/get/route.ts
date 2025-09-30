/**
 * Get Organizer API Endpoint
 * POST /api/organizer/get
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrganizerService } from '@/services/OrganizerService';
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

    const { organizerId } = body;

    if (!organizerId || typeof organizerId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizer ID is required'
        },
        { status: 400 }
      );
    }

    // Get organizer
    const organizer = await OrganizerService.getOrganizerById(organizerId);

    if (!organizer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizer not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: organizer
    });

  } catch (error) {
    console.error('Error in get organizer API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
