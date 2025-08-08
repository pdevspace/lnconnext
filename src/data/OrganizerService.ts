// Service to access Organizer data
import { Organizer, Event } from "@/types/event";
import organizersData from "./event/organizer.json";
import event1 from "./event/event1.json";
import event2 from "./event/event2.json";
import event3 from "./event/event3.json";
import locationsData from "./event/location.json";
import speakersData from "./event/speakers.json";

// Helper function to parse dates from JSON
function parseEventDates(event: any): Event {
  return {
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    sections: event.sections.map((section: any) => ({
      ...section,
      startTime: new Date(section.startTime),
      endTime: section.endTime ? new Date(section.endTime) : undefined,
    })),
  };
}

// Helper function to join event data with related entities
function joinEventData(event: any): Event {
  // Find organizer
  const organizer = organizersData.organizers.find((org: Organizer) => org.id === event.organizer);
  
  // Find location
  const location = locationsData.locations.find((loc: any) => loc.id === event.location);

  // Find speakers
  const speakers = event.speakers.map((speaker: any) => {
    // If speaker is just an ID, find the full speaker object
    if (typeof speaker === 'string') {
      return speakersData.speakers.find((s: any) => s.id === speaker) || 
             { id: speaker, name: "Unknown Speaker", socialMedia: {} };
    }
    // If speaker is already an object, return as is
    return speaker;
  });
  
  // Parse dates
  const parsedEvent = parseEventDates(event);
  
  // Join with related data
  return {
    ...parsedEvent,
    organizer: organizer || { id: event.organizer, name: "Unknown Organizer", socialMedia: {}, speakers: [] },
    location: location || undefined,
    speakers: speakers,
    sections: parsedEvent.sections.map(section => {
      const locationId = String(section.spot.location);
      const sectionLocation = locationsData.locations.find((loc: any) => loc.id === locationId);
      
      // Parse speakers for each section
      const sectionSpeakers = section.speakers.map((speaker: any) => {
        // If speaker is just an ID, find the full speaker object
        if (typeof speaker === 'string') {
          return speakersData.speakers.find((s: any) => s.id === speaker) || 
                 { id: speaker, name: "Unknown Speaker", socialMedia: {} };
        }
        // If speaker is already an object, return as is
        return speaker;
      });
      
      return {
        ...section,
        speakers: sectionSpeakers,
        spot: {
          ...section.spot,
          location: sectionLocation || { id: locationId, buildingName: "Unknown Location", googleMapsUrl: "" }
        }
      };
    })
  };
}

export function getAllOrganizers(): Organizer[] {
  return organizersData.organizers;
}

export function getOrganizerById(id: string): Organizer | undefined {
  return organizersData.organizers.find(organizer => organizer.id === id);
}

export function getEventsByOrganizer(organizerId: string): Event[] {
  const events = [event1, event2, event3];
  const organizerEvents = events.filter(event => event.organizer === organizerId);
  return organizerEvents.map(joinEventData);
} 