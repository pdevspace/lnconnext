import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAll() {
  try {
    console.log('🌱 Starting database seeding process...\n');

    // Clear all data first
    console.log('🧹 Clearing existing data...');
    await prisma.socialMedia.deleteMany();
    await prisma.website.deleteMany();
    await prisma.eventSection.deleteMany();
    await prisma.event.deleteMany();
    await prisma.location.deleteMany();
    await prisma.organizer.deleteMany();
    await prisma.bitcoiner.deleteMany();
    console.log('✅ Cleared existing data\n');

    // Run seed scripts in order
    console.log('👥 Seeding bitcoiners...');
    execSync('npx tsx scripts/seed-bitcoiners.ts', { stdio: 'inherit' });
    console.log('✅ Bitcoiners seeded\n');

    console.log('🏢 Seeding organizers...');
    execSync('npx tsx scripts/seed-organizers.ts', { stdio: 'inherit' });
    console.log('✅ Organizers seeded\n');

    console.log('📍 Seeding locations...');
    execSync('npx tsx scripts/seed-locations.ts', { stdio: 'inherit' });
    console.log('✅ Locations seeded\n');

    console.log('🎉 Seeding events...');
    execSync('npx tsx scripts/seed-events.ts', { stdio: 'inherit' });
    console.log('✅ Events seeded\n');

    console.log('🎊 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Bitcoiners: Seeded with social media profiles');
    console.log('- Organizers: Seeded with social media and website links');
    console.log('- Locations: Seeded with addresses and coordinates');
    console.log('- Events: Seeded with sections, speakers, and websites');

  } catch (error) {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAll();
