import { Event, Location } from "@/types/event";

const eventLocations: Location[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    buildingName: "BOB Space",
    googleMapsUrl: "https://maps.app.goo.gl/txMxnbfE6q7qvhLe7",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    buildingName: "Fitculty",
    googleMapsUrl: "https://maps.app.goo.gl/TgcTKqF2aDc7XHWk7",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    buildingName: "One day esthetic ART CAFE",
    googleMapsUrl: "https://maps.app.goo.gl/814R8DeKeg3k5jPo9",
  },
];

const realBitcoinEvents: Event[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "BOB Space: Mempool & Transactions Month - Meetup 1",
    description:
      "Join us for the first meetup of the Mempool & Transactions Month series at BOB Space. Learn about Bitcoin mempool dynamics, transaction processing, and network congestion.",
    startDate: new Date("2025-07-11T18:30:00"),
    endDate: new Date("2025-07-11T21:00:00"),
    location: eventLocations[0],
    speakers: [],
    sections: [],
    images: ["/images/bob-space.jpg"],
    category: "Bitcoin Meetup",
    tags: ["Bitcoin", "Mempool", "Transactions", "BOB Space", "Meetup"],
    organizer: "BOB Space",
    website: [
      "https://www.meetup.com/bob-space-community-events/events/308880700/?recId=30f85881-a2ed-4c86-9f9d-0320d660a2a2&recSource=event-search&searchId=7bb6002d-fd3e-484b-8e31-19f0dff4a3ef&eventOrigin=find_page%24all",
    ],
    eventSeries: {
      seriesName: "BOB space",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "#THON110: Bitcoiners Meetup in Thonburi",
    description:
      "Join the THON Bitcoin community for meetup #THON110. Connect with fellow Bitcoin enthusiasts in the Thonburi area for discussions, networking, and community building.",
    startDate: new Date("2025-07-13T13:00:00"),
    endDate: new Date("2025-07-13T16:00:00"),
    location: eventLocations[1],
    speakers: [],
    sections: [],
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    ],
    category: "Bitcoin Meetup",
    tags: ["Bitcoin", "Thonburi", "THON Meetup", "Community", "Networking"],
    organizer: "THON Meetup",
    website: [
      "https://web.facebook.com/groups/siamesebitcoiners/posts/1413219543083984/",
    ],
    eventSeries: {
      seriesName: "THON Meetup",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    name: "ลานกรองมันส์: ลานเพื่อนเรา",
    description:
      "A full-day Bitcoin community event featuring morning meetup, community painting, Bitcoin LN market, and live concert by Opensource Band. Join the ลานกรองมันส์ community for a day of Bitcoin culture and entertainment.",
    startDate: new Date("2025-07-19T08:00:00"),
    endDate: new Date("2025-07-19T20:00:00"),
    location: eventLocations[2],
    speakers: [],
    sections: [
      {
        id: "550e8400-e29b-41d4-a716-446655440024",
        sectionName: "Morning Meetup & Community Painting",
        startTime: new Date("2025-07-19T08:00:00"),
        endTime: new Date("2025-07-19T12:00:00"),
        spot: {
          location: eventLocations[2],
        },
        speakers: [],
        description:
          "Morning Bitcoin meetup followed by community painting activities.",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440025",
        sectionName: "Bitcoin NL Market",
        startTime: new Date("2025-07-19T12:00:00"),
        endTime: new Date("2025-07-19T17:30:00"),
        spot: {
          location: eventLocations[2],
        },
        speakers: [],
        description: "Bitcoin NL market with vendors and community trading.",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440026",
        sectionName: "Live Concert by Opensource Band",
        startTime: new Date("2025-07-19T17:30:00"),
        endTime: new Date("2025-07-19T20:00:00"),
        spot: {
          location: eventLocations[2],
        },
        speakers: [],
        description: "Live concert featuring Opensource Band.",
      },
    ],
    images: ["/images/larngrongmans.jpg"],
    category: "Bitcoin Community Event",
    tags: [
      "Bitcoin",
      "ลานเพื่อนเรา",
      "ลานกรองมันส์",
      "Community",
      "Market",
      "Concert",
    ],
    organizer: "ลานกรองมันส์",
    website: [
      "https://web.facebook.com/permalink.php?story_fbid=pfbid02sNCToBn68b9N5mDAtosHBXQnxz7ZJ63ooLfDcqBQnmXHeApG7sgNyKAri9T32Ueul&id=61573404784328",
    ],
    eventSeries: {
      seriesName: "ลานกรองมันส์",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440013",
    name: "Age of Bitcoin KICKSTARTER",
    description:
      "Join the BitToon community for the Age of Bitcoin board game Kickstarter launch! Age of Bitcoin is an exciting board game that explores Bitcoin's journey from creation to adoption. Be among the first to experience this innovative game that combines strategy, education, and Bitcoin culture. Support the Kickstarter campaign and get exclusive early access to the game.",
    startDate: new Date("2025-07-21T00:00:00"),
    endDate: new Date("2025-07-21T23:59:59"),
    speakers: [],
    sections: [],
    images: ["/images/age-of-bitcoin.jpg"],
    category: "Bitcoin Event",
    tags: ["Bitcoin", "BitToon", "KICKSTARTER", "Community"],
    organizer: "BitToon",
    website: [
      "https://web.facebook.com/bittoonfunny/posts/pfbid02c6SA84WWFzCqHiRmbhyjXJGFu6z3mT6FaNdnyuEtqAdMQJnniLQ4L4mCtudgcKVl",
      "https://www.kickstarter.com/projects/whiteelephants/age-of-bitcoin",
    ],
    eventSeries: {
      seriesName: "BitToon",
    },
  },
];

export function getAllBitcoinEvents() {
  return realBitcoinEvents;
}
