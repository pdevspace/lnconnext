import { NextRequest, NextResponse } from 'next/server';
import { OrganizerService } from '@/services/OrganizerService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizerId } = body;

    if (!organizerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizer ID is required',
          message: 'Please provide a valid organizer ID'
        },
        { status: 400 }
      );
    }

    const success = await OrganizerService.deleteOrganizer(organizerId);

    if (!success) {
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
      message: 'Organizer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organizer:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete organizer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
