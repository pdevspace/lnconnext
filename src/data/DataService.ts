// import { Event, RawData, FacebookScrapedData, WebsiteScrapedData, OtherScrapedData } from '@/types/event';
// import event1 from './event/event1.json';
// import event2 from './event/event2.json';
// import event3 from './event/event3.json';
// import organizersData from './organizer.json';
// import locationsData from './location.json';
// import speakersData from './speakers.json';

// // Data access layer abstraction
// export interface IDataService {
//   getEvents(): Promise<Event[]>;
//   getEvent(id: string): Promise<Event | null>;
//   createEvent(event: Omit<Event, 'id'>): Promise<Event>;
//   updateEvent(id: string, event: Partial<Event>): Promise<Event | null>;
//   deleteEvent(id: string): Promise<boolean>;
//   getRawData(organizerId?: string): Promise<RawData[]>;
//   createRawData(rawData: Omit<RawData, 'id'>): Promise<RawData>;
//   scrapeFacebookPost(postIdOrUrl: string): Promise<FacebookScrapedData>;
// }

// // Helper function to parse dates from JSON
// function parseEventDates(event: any): Event {
//   return {
//     ...event,
//     startDate: new Date(event.startDate),
//     endDate: new Date(event.endDate),
//     sections: event.sections.map((section: any) => ({
//       ...section,
//       startTime: new Date(section.startTime),
//       endTime: section.endTime ? new Date(section.endTime) : undefined,
//     })),
//   };
// }

// // Helper function to join event data with related entities
// function joinEventData(event: any): Event {
//   // Find organizer
//   const organizer = organizersData.organizers.find((org: any) => org.id === event.organizer);
  
//   // Find location
//   const location = locationsData.locations.find((loc: any) => loc.id === event.location);
  
//   // Parse dates
//   const parsedEvent = parseEventDates(event);
  
//   // Parse speakers for the event (event.speakers is already an array of Speaker objects)
//   const parsedSpeakers = event.speakers.map((speaker: any) => {
//     // If speaker is just an ID, find the full speaker object
//     if (typeof speaker === 'string') {
//       return speakersData.speakers.find((s: any) => s.id === speaker) || 
//              { id: speaker, name: "Unknown Speaker", socialMedia: {} };
//     }
//     // If speaker is already an object, return as is
//     return speaker;
//   });
  
//   // Join with related data
//   return {
//     ...parsedEvent,
//     organizer: organizer || { id: event.organizer, name: "Unknown Organizer", socialMedia: {}, speakers: [] },
//     location: location || undefined,
//     speakers: parsedSpeakers,
//     sections: parsedEvent.sections.map(section => {
//       const locationId = String(section.spot.location);
//       const sectionLocation = locationsData.locations.find((loc: any) => loc.id === locationId);
      
//       // Parse speakers for each section
//       const sectionSpeakers = section.speakers.map((speaker: any) => {
//         // If speaker is just an ID, find the full speaker object
//         if (typeof speaker === 'string') {
//           return speakersData.speakers.find((s: any) => s.id === speaker) || 
//                  { id: speaker, name: "Unknown Speaker", socialMedia: {} };
//         }
//         // If speaker is already an object, return as is
//         return speaker;
//       });
      
//       return {
//         ...section,
//         speakers: sectionSpeakers,
//         spot: {
//           ...section.spot,
//           location: sectionLocation || { id: locationId, buildingName: "Unknown Location", googleMapsUrl: "" }
//         }
//       };
//     })
//   };
// }

// // Helper function to parse raw data dates from JSON
// function parseRawDataDates(rawData: any): RawData {
//   return {
//     ...rawData,
//     createdAt: new Date(rawData.createdAt),
//     scrapedData: {
//       ...rawData.scrapedData,
//       ...(rawData.scrapedData.postDate && { postDate: new Date(rawData.scrapedData.postDate) }),
//       ...(rawData.scrapedData.scrapedAt && { scrapedAt: new Date(rawData.scrapedData.scrapedAt) }),
//     },
//   };
// }

// // JSON-based implementation
// export class JsonDataService implements IDataService {
//   private events: Event[] = [];
//   private rawData: RawData[] = [];

//   constructor() {
//     this.loadData();
//   }

//   private async loadData() {
//     try {
//       // Load events from individual JSON files
//       const eventFiles = [event1, event2, event3];
//       this.events = eventFiles.map(joinEventData);
      
//       // Load raw data from JSON
//       this.rawData = rawDataData.rawData.map(parseRawDataDates);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   }

//   async getEvents(): Promise<Event[]> {
//     await this.loadData();
//     return this.events;
//   }

//   async getEvent(id: string): Promise<Event | null> {
//     await this.loadData();
//     return this.events.find(event => event.id === id) || null;
//   }

//   async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
//     const newEvent: Event = {
//       ...event,
//       id: Date.now().toString() // Simple ID generation
//     };
//     this.events.push(newEvent);
//     return newEvent;
//   }

//   async updateEvent(id: string, event: Partial<Event>): Promise<Event | null> {
//     const index = this.events.findIndex(e => e.id === id);
//     if (index === -1) return null;
    
//     this.events[index] = { ...this.events[index], ...event };
//     return this.events[index];
//   }

//   async deleteEvent(id: string): Promise<boolean> {
//     const index = this.events.findIndex(e => e.id === id);
//     if (index === -1) return false;
    
//     this.events.splice(index, 1);
//     return true;
//   }

//   async getRawData(organizerId?: string): Promise<RawData[]> {
//     await this.loadData();
//     if (organizerId) {
//       return this.rawData.filter(data => data.organizerId === organizerId);
//     }
//     return this.rawData;
//   }

//   async createRawData(rawData: Omit<RawData, 'id'>): Promise<RawData> {
//     const newRawData: RawData = {
//       ...rawData,
//       id: Date.now().toString()
//     };
//     this.rawData.push(newRawData);
//     return newRawData;
//   }

//   async scrapeFacebookPost(postIdOrUrl: string): Promise<FacebookScrapedData> {
//     // Mock implementation - in real app, this would call Facebook API or scraping service
//     return {
//       user: {
//         username: 'Mock User',
//         profileUrl: 'https://facebook.com/mockuser'
//       },
//       title: 'Scraped Post Title',
//       content: 'This is the scraped content from the Facebook post...',
//       images: ['/images/bob-space.jpg'],
//       postDate: new Date()
//     };
//   }
// }

// // Singleton instance
// export const dataService = new JsonDataService(); 