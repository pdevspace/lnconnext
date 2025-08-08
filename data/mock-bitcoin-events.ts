import { Event, Location, Organizer } from "@/types/event";

let bitcoinEvents: Event[] = [];

const eventOrganizers: Record<string, Organizer> = {
  bittoon: {
    id: "7d3ef82d-5e48-4f0f-97d1-842d72a146e1",
    name: "BitToon",
    socialMedia: {},
    speakers: [],
  },
  thon: {
    id: "18f0c2b2-2c07-45f5-899c-2fc17c179c17",
    name: "THON Meetup",
    socialMedia: {},
    speakers: [],
  },
  bobspace: {
    id: "b8f8f7e5-0658-4306-b3fd-f008c4e2b2e2",
    name: "BOB Space",
    socialMedia: {},
    speakers: [],
  },
  larngrongmans: {
    id: "9d0c6d03-36c3-4710-84f3-150c9e92d969",
    name: "ลานกรองมันส์",
    socialMedia: {},
    speakers: [],
  },
};

const eventLocations: Record<string, Location> = {
  bobspace: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    buildingName: "BOB Space",
    googleMapsUrl: "https://maps.app.goo.gl/txMxnbfE6q7qvhLe7",
  },
  fitculty: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    buildingName: "Fitculty",
    googleMapsUrl: "https://maps.app.goo.gl/TgcTKqF2aDc7XHWk7",
  },
  onedaycafe: {
    id: "550e8400-e29b-41d4-a716-446655440003",
    buildingName: "One day esthetic ART CAFE",
    googleMapsUrl: "https://maps.app.goo.gl/814R8DeKeg3k5jPo9",
  },
};

bitcoinEvents.push({
  id: "550e8400-e29b-41d4-a716-446655440010",
  name: "Mempool & Transactions Month - Meetup 1",
  description:
    "Join us for the first meetup of the Mempool & Transactions Month series at BOB Space. Learn about Bitcoin mempool dynamics, transaction processing, and network congestion.",
  organizer: eventOrganizers.bobspace,
  eventSeriesName: "BOB space",
  location: eventLocations.bobspace,
  sections: [],
  price: 0,
  startDate: new Date("2025-07-11T18:30:00"),
  endDate: new Date("2025-07-11T21:00:00"),
  speakers: [],
  images: ["/images/bob-space.jpg"],
  website: [
    "https://www.meetup.com/bob-space-community-events/events/308880700/?recId=30f85881-a2ed-4c86-9f9d-0320d660a2a2&recSource=event-search&searchId=7bb6002d-fd3e-484b-8e31-19f0dff4a3ef&eventOrigin=find_page%24all",
  ],
  socialMedia:{},
})

bitcoinEvents.push({
  id: "550e8400-e29b-41d4-a716-446655440011",
  name: "#THON110: Bitcoiners Meetup in Thonburi",
  description:
    "Join the THON Bitcoin community for meetup #THON110. Connect with fellow Bitcoin enthusiasts in the Thonburi area for discussions, networking, and community building.",
  organizer: eventOrganizers.thonMeetup,
  eventSeriesName: "THON Meetup",
  location: eventLocations.fitculty,
  sections: [],
  price: 0,
  startDate: new Date("2025-07-13T13:00:00"),
  endDate: new Date("2025-07-13T16:00:00"),
  speakers: [],
  images: [
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
  ],
  website: [
    "https://web.facebook.com/groups/siamesebitcoiners/posts/1413219543083984/",
  ],
  socialMedia: {},
})

bitcoinEvents.push({
  id: "550e8400-e29b-41d4-a716-446655440012",
  name: "ลานเพื่อนเรา",
  description:
    "A full-day Bitcoin community event featuring morning meetup, community painting, Bitcoin LN market, and live concert by Opensource Band. Join the ลานกรองมันส์ community for a day of Bitcoin culture and entertainment.",
  organizer: eventOrganizers.larngrongmans,
  eventSeriesName: "ลานกรองมันส์",
  location: eventLocations.onedaycafe,
  sections: [
    {
      id: "550e8400-e29b-41d4-a716-446655440024",
      sectionName: "Morning Meetup & Community Painting",
      startTime: new Date("2025-07-19T08:00:00"),
      endTime: new Date("2025-07-19T12:00:00"),
      spot: { location: eventLocations.onedaycafe },
      speakers: [],
      description: "Morning Bitcoin meetup followed by community painting activities.",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440025",
      sectionName: "Bitcoin NL Market",
      startTime: new Date("2025-07-19T12:00:00"),
      endTime: new Date("2025-07-19T17:30:00"),
      spot: { location: eventLocations.onedaycafe },
      speakers: [],
      description: "Bitcoin NL market with vendors and community trading.",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440026",
      sectionName: "Live Concert by Opensource Band",
      startTime: new Date("2025-07-19T17:30:00"),
      endTime: new Date("2025-07-19T20:00:00"),
      spot: { location: eventLocations.onedaycafe },
      speakers: [],
      description: "Live concert featuring Opensource Band.",
    },
  ],
  price: 0,
  startDate: new Date("2025-07-19T08:00:00"),
  endDate: new Date("2025-07-19T20:00:00"),
  speakers: [],
  images: ["/images/larngrongmans.jpg"],
  website: [
    "https://web.facebook.com/permalink.php?story_fbid=pfbid02sNCToBn68b9N5mDAtosHBXQnxz7ZJ63ooLfDcqBQnmXHeApG7sgNyKAri9T32Ueul&id=61573404784328",
  ],
  socialMedia: {},
})

export function getAllBitcoinEvents() {
  return bitcoinEvents;
}
