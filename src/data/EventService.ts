// Service to access Bitcoin event data
import { Event, Organizer, Location, Speaker } from "@/types/event";
import event1 from "./event/event1.json";
import event2 from "./event/event2.json";
import event3 from "./event/event3.json";
import event4 from "./event/event4.json";
import event5 from "./event/event5.json";
import event6 from "./event/event6.json";
import event7 from "./event/event7.json";
import event8 from "./event/event8.json";
import event9 from "./event/event9.json";
import organizersData from "./event/organizer.json";
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
  const organizer = organizersData.organizers.find(
    (org: any) => org.id === event.organizer
  );

  // Find location
  const location = locationsData.locations.find(
    (loc: any) => loc.id === event.location
  );

  // Find speakers
  const speakers = event.speakers.map((speaker: any) => {
    // If speaker is just an ID, find the full speaker object
    if (typeof speaker === "string") {
      return (
        speakersData.speakers.find((s: any) => s.id === speaker) || {
          id: speaker,
          name: "Unknown Speaker",
          socialMedia: {},
        }
      );
    }
    // If speaker is already an object, return as is
    return speaker;
  });

  // Parse dates
  const parsedEvent = parseEventDates(event);

  // Join with related data
  return {
    ...parsedEvent,
    organizer: (organizer as Organizer) || {
      id: event.organizer,
      name: "Unknown Organizer",
      socialMedia: [],
      speakers: [],
    },
    location: (location as Location) || undefined,
    speakers: speakers,
    sections: parsedEvent.sections.map((section) => {
      const locationId = String(section.spot.location);
      const sectionLocation = locationsData.locations.find(
        (loc: any) => loc.id === locationId
      );

      // Parse speakers for each section
      const sectionSpeakers = section.speakers.map((speaker: any) => {
        // If speaker is just an ID, find the full speaker object
        if (typeof speaker === "string") {
          return (
            speakersData.speakers.find((s: any) => s.id === speaker) || {
              id: speaker,
              name: "Unknown Speaker",
              socialMedia: {},
            }
          );
        }
        // If speaker is already an object, return as is
        return speaker;
      });

      return {
        ...section,
        speakers: sectionSpeakers,
        spot: {
          ...section.spot,
          location: (sectionLocation as Location) || {
            id: locationId,
            buildingName: "Unknown Location",
            googleMapsUrl: "",
          },
        },
      };
    }),
  };
}

export function getAllEvents(): Event[] {
  const events = [
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
    event7,
    event8,
    event9,
  ];
  const joinedEvents = events.map(joinEventData);
  return joinedEvents.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
}

export function getEventById(id: string): Event | undefined {
  const events = [
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
    event7,
    event8,
    event9,
  ];
  const event = events.find((event) => event.id === id);
  return event ? joinEventData(event) : undefined;
}
