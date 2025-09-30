import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLocations() {
  try {
    // Clear existing data
    await prisma.location.deleteMany();

    // Create locations
    const locations = [
      {
        buildingName: 'BOB Space',
        address: '123 Sukhumvit Road, Khlong Toei, Bangkok 10110',
        city: 'Bangkok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/txMxnbfE6q7qvhLe7',
        coordinates: {
          lat: 13.736717,
          lng: 100.523186
        }
      },
      {
        buildingName: 'Fitculty',
        address: '456 Silom Road, Bang Rak, Bangkok 10500',
        city: 'Bangkok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/TgcTKqF2aDc7XHWk7',
        coordinates: {
          lat: 13.7307,
          lng: 100.5237
        }
      },
      {
        buildingName: 'One day esthetic ART CAFE',
        address: '789 Thonglor Road, Watthana, Bangkok 10110',
        city: 'Bangkok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/814R8DeKeg3k5jPo9',
        coordinates: {
          lat: 13.7651,
          lng: 100.5383
        }
      },
      {
        buildingName: 'ห้อง QS 2301 อาคารเฉลิมพระเกียรติ 72 พรรษา บรมราชินีนาถ มหาวิทยาลัยนเรศวร จ.พิษณุโลก',
        address: 'มหาวิทยาลัยนเรศวร ตำบลท่าโพธิ์ อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก 65000',
        city: 'Phitsanulok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/example',
        coordinates: {
          lat: 16.8211,
          lng: 100.2659
        }
      },
      {
        buildingName: 'Railway Park, Chiang Mai',
        address: 'Railway Park, Mueang Chiang Mai District, Chiang Mai 50000',
        city: 'Chiang Mai',
        country: 'Thailand',
        googleMapsUrl: 'https://www.google.com/maps/place/Chiangmai+Railway+station+Park+Mueang+Chiang+Mai+District/data=!4m2!3m1!1s0x30da2500427e9ca5:0x75ef58b3ee98ae41?sa=X&ved=1t:242&ictx=111',
        coordinates: {
          lat: 18.7883,
          lng: 98.9853
        }
      },
      {
        buildingName: 'Bitcoin Learning Center Chiang Mai',
        address: 'Bitcoin Learning Center, Mueang Chiang Mai District, Chiang Mai 50000',
        city: 'Chiang Mai',
        country: 'Thailand',
        googleMapsUrl: 'https://www.google.com/maps/place/Bitcoin+Learning+Center/data=!4m2!3m1!1s0x0:0x45b9ed973f81fa8e?sa=X&ved=1t:2428&ictx=111',
        coordinates: {
          lat: 18.7883,
          lng: 98.9853
        }
      },
      {
        buildingName: 'Central World',
        address: '999/9 Rama I Rd, Pathum Wan, Bangkok 10330',
        city: 'Bangkok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/centralworld',
        coordinates: {
          lat: 13.7472,
          lng: 100.5397
        }
      },
      {
        buildingName: 'Siam Paragon',
        address: '991 Rama I Rd, Pathum Wan, Bangkok 10330',
        city: 'Bangkok',
        country: 'Thailand',
        googleMapsUrl: 'https://maps.app.goo.gl/siamparagon',
        coordinates: {
          lat: 13.7464,
          lng: 100.5347
        }
      }
    ];

    for (const locationData of locations) {
      const location = await prisma.location.create({
        data: {
          buildingName: locationData.buildingName,
          address: locationData.address,
          city: locationData.city,
          country: locationData.country,
          googleMapsUrl: locationData.googleMapsUrl,
          coordinates: locationData.coordinates
        }
      });

      console.log(`✅ Created location: ${location.buildingName}`);
    }

    console.log('✅ Successfully seeded locations data');
  } catch (error) {
    console.error('❌ Error seeding locations data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLocations();
