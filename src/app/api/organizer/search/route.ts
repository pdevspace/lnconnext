/**
 * Search Organizers API Endpoint
 * POST /api/organizer/search
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

    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required'
        },
        { status: 400 }
      );
    }

    // Search organizers
    const organizers = await OrganizerService.searchOrganizers(query);

    return NextResponse.json({
      success: true,
      data: organizers
    });

  } catch (error) {
    console.error('Error in search organizers API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
