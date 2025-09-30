import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  try {
    // Clear existing data
    await prisma.socialMedia.deleteMany({
      where: { ownerType: 'bitcoiner' }
    });
    await prisma.website.deleteMany();
    await prisma.eventSection.deleteMany();
    await prisma.event.deleteMany();

    // Get existing organizers and locations
    const organizers = await prisma.organizer.findMany();
    const locations = await prisma.location.findMany();
    const bitcoiners = await prisma.bitcoiner.findMany();

    if (organizers.length === 0) {
      console.log('❌ No organizers found. Please run seed-organizers.ts first');
      return;
    }

    if (locations.length === 0) {
      console.log('❌ No locations found. Please run seed-locations.ts first');
      return;
    }

    if (bitcoiners.length === 0) {
      console.log('❌ No bitcoiners found. Please run seed-bitcoiners.ts first');
      return;
    }

    // Create events
    const events = [
      {
        name: 'Mempool & Transactions Month - Meetup 1',
        description: 'Join us for the first meetup of the Mempool & Transactions Month series at BOB Space. Learn about Bitcoin mempool dynamics, transaction processing, and network congestion.',
        eventSeriesName: 'BOB space',
        price: 0,
        startDate: new Date('2025-07-11T18:30:00.000+07:00'),
        endDate: new Date('2025-07-11T21:00:00.000+07:00'),
        images: ['/images/bob-space.jpg'],
        organizerId: organizers[0].id, // BOB Space
        locationId: locations[0].id, // BOB Space
        websites: [
          {
            url: 'https://www.meetup.com/bob-space-community-events/events/308880700/',
            type: 'other',
            displayText: 'Join Meetup'
          }
        ],
        register: {
          url: 'https://www.meetup.com/bob-space-community-events/events/308880700/',
          type: 'other',
          displayText: 'Register (Free)'
        },
        sections: [],
        speakerIds: []
      },
      {
        name: '#THON110: Bitcoiners Meetup in Thonburi',
        description: 'Join the THON Bitcoin community for meetup #THON110. Connect with fellow Bitcoin enthusiasts in the Thonburi area for discussions, networking, and community building.',
        eventSeriesName: 'THON Meetup',
        price: 0,
        startDate: new Date('2025-07-13T13:00:00.000+07:00'),
        endDate: new Date('2025-07-13T16:00:00.000+07:00'),
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop'
        ],
        organizerId: organizers[1].id, // THON Meetup
        locationId: locations[1].id, // Fitculty
        websites: [
          {
            url: 'https://web.facebook.com/groups/siamesebitcoiners/posts/1413219543083984/',
            type: 'facebook',
            displayText: 'Facebook Post'
          }
        ],
        sections: [],
        speakerIds: []
      },
      {
        name: 'Bitcoin Education Workshop - Lightning Network Basics',
        description: 'Learn the fundamentals of the Lightning Network in this hands-on workshop. Perfect for beginners who want to understand how Lightning works and how to use it.',
        eventSeriesName: 'BLC Chiang Mai',
        price: 500,
        startDate: new Date('2025-07-20T09:00:00.000+07:00'),
        endDate: new Date('2025-07-20T17:00:00.000+07:00'),
        images: ['/images/bitcoin-learning-center.jpg'],
        organizerId: organizers[3].id, // BLC Chiang Mai
        locationId: locations[5].id, // Bitcoin Learning Center Chiang Mai
        websites: [
          {
            url: 'https://blcchiangmai.com/workshops',
            type: 'other',
            displayText: 'Workshop Details'
          }
        ],
        register: {
          url: 'https://blcchiangmai.com/register',
          type: 'other',
          displayText: 'Register Now'
        },
        sections: [
          {
            sectionName: 'Introduction to Lightning Network',
            startTime: new Date('2025-07-20T09:00:00.000+07:00'),
            endTime: new Date('2025-07-20T10:30:00.000+07:00'),
            spot: 'Main Hall',
            description: 'Overview of Lightning Network concepts and benefits',
            speakerIds: [bitcoiners[0].id, bitcoiners[1].id] // อ.พิริยะ, อ.วิชิต
          },
          {
            sectionName: 'Hands-on Lightning Setup',
            startTime: new Date('2025-07-20T10:45:00.000+07:00'),
            endTime: new Date('2025-07-20T12:15:00.000+07:00'),
            spot: 'Computer Lab',
            description: 'Practical session on setting up Lightning wallets',
            speakerIds: [bitcoiners[2].id, bitcoiners[3].id] // รศ.ดร.วัชรพล, อ.ขิง
          },
          {
            sectionName: 'Advanced Lightning Concepts',
            startTime: new Date('2025-07-20T13:30:00.000+07:00'),
            endTime: new Date('2025-07-20T15:00:00.000+07:00'),
            spot: 'Main Hall',
            description: 'Channel management, routing, and optimization',
            speakerIds: [bitcoiners[0].id] // อ.พิริยะ
          }
        ],
        speakerIds: [bitcoiners[0].id, bitcoiners[1].id, bitcoiners[2].id, bitcoiners[3].id]
      },
      {
        name: 'Bitcoin Conference 2025 - Main Event',
        description: 'The biggest Bitcoin conference in Thailand featuring top speakers, workshops, and networking opportunities. Join us for two days of Bitcoin education and community building.',
        eventSeriesName: 'Bitcoin Thailand Conference',
        price: 2000,
        startDate: new Date('2025-08-15T08:00:00.000+07:00'),
        endDate: new Date('2025-08-16T18:00:00.000+07:00'),
        images: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop'
        ],
        organizerId: organizers[6].id, // Bitcoin Thailand
        locationId: locations[6].id, // Central World
        websites: [
          {
            url: 'https://bitcointhailand.org/conference2025',
            type: 'other',
            displayText: 'Conference Website'
          },
          {
            url: 'https://web.facebook.com/events/bitcoin-conference-2025',
            type: 'facebook',
            displayText: 'Facebook Event'
          }
        ],
        register: {
          url: 'https://bitcointhailand.org/register',
          type: 'other',
          displayText: 'Buy Tickets'
        },
        sections: [
          {
            sectionName: 'Opening Keynote',
            startTime: new Date('2025-08-15T09:00:00.000+07:00'),
            endTime: new Date('2025-08-15T10:00:00.000+07:00'),
            spot: 'Main Auditorium',
            description: 'The future of Bitcoin in Thailand and Southeast Asia',
            speakerIds: [bitcoiners[0].id, bitcoiners[1].id]
          },
          {
            sectionName: 'Technical Workshops',
            startTime: new Date('2025-08-15T10:30:00.000+07:00'),
            endTime: new Date('2025-08-15T12:00:00.000+07:00'),
            spot: 'Workshop Room A',
            description: 'Advanced Bitcoin development and Lightning Network',
            speakerIds: [bitcoiners[2].id, bitcoiners[3].id]
          }
        ],
        speakerIds: bitcoiners.map(b => b.id) // All speakers
      },
      {
        name: 'Lightning Network Development Meetup',
        description: 'Monthly meetup for Lightning Network developers and enthusiasts. Share knowledge, discuss latest developments, and collaborate on projects.',
        eventSeriesName: 'Lightning Network Thailand',
        price: 0,
        startDate: new Date('2025-07-25T19:00:00.000+07:00'),
        endDate: new Date('2025-07-25T21:30:00.000+07:00'),
        images: ['/images/lightning-network.jpg'],
        organizerId: organizers[7].id, // Lightning Network Thailand
        locationId: locations[0].id, // BOB Space
        websites: [
          {
            url: 'https://lightningthailand.com/meetups',
            type: 'other',
            displayText: 'Meetup Details'
          }
        ],
        sections: [
          {
            sectionName: 'Lightning Network Updates',
            startTime: new Date('2025-07-25T19:00:00.000+07:00'),
            endTime: new Date('2025-07-25T19:45:00.000+07:00'),
            spot: 'Conference Room',
            description: 'Latest developments in Lightning Network',
            speakerIds: [bitcoiners[4].id, bitcoiners[5].id]
          },
          {
            sectionName: 'Open Discussion',
            startTime: new Date('2025-07-25T20:00:00.000+07:00'),
            endTime: new Date('2025-07-25T21:30:00.000+07:00'),
            spot: 'Conference Room',
            description: 'Q&A and open discussion about Lightning Network',
            speakerIds: []
          }
        ],
        speakerIds: [bitcoiners[4].id, bitcoiners[5].id, bitcoiners[6].id]
      }
    ];

    for (const eventData of events) {
      // Create websites first
      const websites = await Promise.all(
        eventData.websites.map(websiteData =>
          prisma.website.create({
            data: {
              url: websiteData.url,
              type: websiteData.type,
              displayText: websiteData.displayText
            }
          })
        )
      );

      // Create register website if exists
      let registerWebsite = null;
      if (eventData.register) {
        registerWebsite = await prisma.website.create({
          data: {
            url: eventData.register.url,
            type: eventData.register.type,
            displayText: eventData.register.displayText
          }
        });
      }

      // Create event
      const event = await prisma.event.create({
        data: {
          name: eventData.name,
          description: eventData.description,
          eventSeriesName: eventData.eventSeriesName,
          price: eventData.price,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          images: eventData.images,
          organizerId: eventData.organizerId,
          locationId: eventData.locationId,
          registerId: registerWebsite?.id,
          eventBitcoiners: {
            create: eventData.speakerIds.map(bitcoinerId => ({
              bitcoinerId
            }))
          },
          websites: {
            connect: websites.map(w => ({ id: w.id }))
          }
        }
      });

      // Create event sections
      for (const sectionData of eventData.sections) {
        const section = await prisma.eventSection.create({
          data: {
            sectionName: sectionData.sectionName,
            startTime: sectionData.startTime,
            endTime: sectionData.endTime,
            spot: sectionData.spot,
            description: sectionData.description,
            eventId: event.id
          }
        });

        // Create section-bitcoiner relationships
        if (sectionData.speakerIds.length > 0) {
          await prisma.sectionBitcoiner.createMany({
            data: sectionData.speakerIds.map(bitcoinerId => ({
              sectionId: section.id,
              bitcoinerId
            }))
          });
        }
      }

      console.log(`✅ Created event: ${event.name}`);
    }

    console.log('✅ Successfully seeded events data');
  } catch (error) {
    console.error('❌ Error seeding events data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();
