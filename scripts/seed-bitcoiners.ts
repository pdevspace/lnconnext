import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBitcoiners() {
  try {
    // Clear existing data
    await prisma.socialMedia.deleteMany();
    await prisma.bitcoiner.deleteMany();

    // Create bitcoiners with social media
    const bitcoiners = [
      {
        name: 'อ.พิริยะ',
        socialMedia: [
          {
            displayText: 'เพจ อ.พิริยะ',
            username: 'piriyat_official',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/piriyat_official'
          }
        ]
      },
      {
        name: 'อ.วิชิต',
        socialMedia: [
          {
            displayText: 'YouTube อ.วิชิต',
            username: 'VichitBitcoin',
            platform: 'youtube',
            urlLink: 'https://www.youtube.com/@VichitBitcoin'
          },
          {
            displayText: 'Twitter อ.วิชิต',
            username: 'VichitBitcoin',
            platform: 'twitter',
            urlLink: 'https://twitter.com/VichitBitcoin'
          }
        ]
      },
      {
        name: 'รศ.ดร.วัชรพล',
        socialMedia: [
          {
            displayText: 'LinkedIn รศ.ดร.วัชรพล',
            username: 'watcharaphon',
            platform: 'linkedin',
            urlLink: 'https://linkedin.com/in/watcharaphon'
          }
        ]
      },
      {
        name: 'อ.ขิง',
        socialMedia: [
          {
            displayText: 'เพจ อ.ขิง',
            username: 'KhingBitcoin',
            platform: 'facebook',
            urlLink: 'https://web.facebook.com/KhingBitcoin'
          },
          {
            displayText: 'Instagram อ.ขิง',
            username: 'khing_bitcoin',
            platform: 'instagram',
            urlLink: 'https://instagram.com/khing_bitcoin'
          }
        ]
      },
      {
        name: 'คุณซุป',
        socialMedia: []
      },
      {
        name: 'คุณต้า',
        socialMedia: []
      },
      {
        name: 'คุณอิสระ',
        socialMedia: []
      },
      {
        name: 'คุณอีฟ',
        socialMedia: []
      },
      {
        name: 'ร.ท.ณัฐกิตติ์',
        socialMedia: []
      }
    ];

    for (const bitcoinerData of bitcoiners) {
      await prisma.bitcoiner.create({
        data: {
          name: bitcoinerData.name,
          socialMedia: {
            create: bitcoinerData.socialMedia
          }
        }
      });
    }

    console.log('✅ Successfully seeded bitcoiners data');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBitcoiners();
