import { NextRequest, NextResponse } from 'next/server';
import { validateApiRequest } from '@/utils/backendValidators';
import { OrganizerService } from '@/services/OrganizerService';

interface CreateRequest {
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  isActive: boolean;
  socialMediaIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRequest = await request.json();

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

    // Create the organizer
    const newOrganizer = await OrganizerService.createOrganizer({
      name: body.name,
      bio: body.bio,
      avatar: body.avatar,
      website: body.website,
      isActive: body.isActive,
      socialMediaIds: body.socialMediaIds
    });

    return NextResponse.json({
      success: true,
      data: newOrganizer,
      message: 'Organizer created successfully'
    });

  } catch (error) {
    console.error('Error creating organizer:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create organizer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
