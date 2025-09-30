/**
 * List Organizers API Endpoint
 * POST /api/organizer/list
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

    const { filters = {} } = body;

    // Get organizers
    const organizers = await OrganizerService.getAllOrganizers(filters);

    return NextResponse.json({
      success: true,
      data: organizers,
      pagination: {
        total: organizers.length,
        page: 1,
        limit: filters.limit || 50,
        hasMore: organizers.length === (filters.limit || 50)
      }
    });

  } catch (error) {
    console.error('Error in list organizers API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
