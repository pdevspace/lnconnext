import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrganizers() {
  try {
    // Clear existing data
    await prisma.socialMedia.deleteMany({
      where: { ownerType: 'organizer' }
    });
    await prisma.organizer.deleteMany();

    // Create organizers with social media
    const organizers = [
      {
        name: 'BOB Space',
        bio: 'A community space for Bitcoin enthusiasts and developers in Bangkok',
        website: 'https://bobspace.co',
        socialMedia: []
      },
      {
        name: 'THON Meetup',
        bio: 'Bitcoin meetup community in Thailand',
        website: 'https://thon.meetup.com',
        socialMedia: []
      },
      {
        name: 'ลานกรองมันส์',
        bio: 'Bitcoin education and community events in Thailand',
        website: 'https://lankrongman.com',
        socialMedia: [
          {
            displayText: 'เพจ ลานกรองมันส์',
            username: 'ลานกรองมันส์',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/profile.php?id=61573404784328&sk=followers'
          },
          {
            displayText: 'youtube ลานกรองมันส์',
            username: 'ลานกรองมันส์',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/channel/UC1DgORRoe438eb4SAnKulHw'
          }
        ]
      },
      {
        name: 'BLC Chiang Mai',
        bio: 'Bitcoin Learning Center Chiang Mai - Educational events and workshops',
        website: 'https://blcchiangmai.com',
        socialMedia: [
          {
            displayText: 'เพจ BLC Chiang Mai',
            username: 'BLC Chiang Mai',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/blcchiangmai'
          },
          {
            displayText: 'youtube BitcoinChiangMai',
            username: 'BitcoinChiangMai',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/@BitcoinChiangMai'
          }
        ]
      },
      {
        name: 'Right Shift',
        bio: 'Bitcoin and Lightning Network development community',
        website: 'https://rightshift.io',
        socialMedia: [
          {
            displayText: 'youtube rightshift',
            username: 'rightshift',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/@rightshift'
          },
          {
            displayText: 'เพจ rightshift',
            username: 'LightningPiranha',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/LightningPiranha'
          }
        ]
      },
      {
        name: 'P\' Chit',
        bio: 'Bitcoin educator and community organizer',
        website: 'https://chithole.com',
        socialMedia: [
          {
            displayText: 'chithole',
            username: 'chitholeofficial',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/chitholeofficial'
          },
          {
            displayText: 'เพจ P\'Chit',
            username: 'wsaiklao',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/wsaiklao/?locale=th_TH&_rdc=1&_rdr'
          },
          {
            displayText: 'youtube satochit',
            username: 'Satochit',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/@Satochit'
          }
        ]
      },
      {
        name: 'Bitcoin Thailand',
        bio: 'Official Bitcoin community in Thailand',
        website: 'https://bitcointhailand.org',
        socialMedia: [
          {
            displayText: 'Bitcoin Thailand Facebook',
            username: 'BitcoinThailand',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/BitcoinThailand'
          },
          {
            displayText: 'Bitcoin Thailand Twitter',
            username: 'BitcoinThailand',
            platform: 'twitter',
            urlLink: 'https://twitter.com/BitcoinThailand'
          }
        ]
      },
      {
        name: 'Lightning Network Thailand',
        bio: 'Lightning Network development and education in Thailand',
        website: 'https://lightningthailand.com',
        socialMedia: [
          {
            displayText: 'Lightning Thailand LinkedIn',
            username: 'LightningThailand',
            platform: 'linkedin',
            urlLink: 'https://linkedin.com/company/lightning-thailand'
          }
        ]
      }
    ];

    for (const organizerData of organizers) {
      const organizer = await prisma.organizer.create({
        data: {
          name: organizerData.name,
          bio: organizerData.bio,
          website: organizerData.website,
          isActive: true,
          socialMedia: {
            create: organizerData.socialMedia.map(sm => ({
              ...sm,
              ownerType: 'organizer'
            }))
          }
        }
      });

      console.log(`✅ Created organizer: ${organizer.name}`);
    }

    console.log('✅ Successfully seeded organizers data');
  } catch (error) {
    console.error('❌ Error seeding organizers data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedOrganizers();
