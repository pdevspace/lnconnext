import { NextRequest, NextResponse } from 'next/server';
import { validateApiRequest } from '@/utils/backendValidators';
import { OrganizerService } from '@/services/OrganizerService';

interface UpdateRequest {
  organizerId: string;
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  socialMediaIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();

    if (!body.organizerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizer ID is required',
          message: 'Please provide a valid organizer ID'
        },
        { status: 400 }
      );
    }

    // Validate the request data
    const validation = validateApiRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          message: 'Please check your input and try again',
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    // Update the organizer
    const updatedOrganizer = await OrganizerService.updateOrganizer(body.organizerId, {
      name: body.name,
      bio: body.bio,
      avatar: body.avatar,
      website: body.website,
      isActive: body.isActive,
      socialMediaIds: body.socialMediaIds
    });

    if (!updatedOrganizer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizer not found',
          message: 'No organizer found with the provided ID'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrganizer,
      message: 'Organizer updated successfully'
    });

  } catch (error) {
    console.error('Error updating organizer:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update organizer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
