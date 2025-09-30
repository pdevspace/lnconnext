# Database Seed Scripts

This directory contains scripts to seed the database with sample data for development and testing.

## Available Scripts

### Individual Seed Scripts

- **`seed-bitcoiners.ts`** - Seeds bitcoiners with social media profiles
- **`seed-organizers.ts`** - Seeds event organizers with social media and website links
- **`seed-locations.ts`** - Seeds event locations with addresses and coordinates
- **`seed-events.ts`** - Seeds events with sections, speakers, and websites

### Master Seed Script

- **`seed-all.ts`** - Runs all seed scripts in the correct order

## Usage

### Run All Seeds
```bash
npm run db:seed
```

### Run Individual Seeds
```bash
# Seed only bitcoiners
npm run db:seed:bitcoiners

# Seed only organizers
npm run db:seed:organizers

# Seed only locations
npm run db:seed:locations

# Seed only events
npm run db:seed:events
```

### Reset Database and Seed
```bash
npm run db:reset
```

## Data Structure

### Bitcoiners
- Name and basic information
- Social media profiles (Facebook, YouTube, Twitter, LinkedIn, Instagram)
- Expertise areas

### Organizers
- Organization name and bio
- Website links
- Social media profiles
- Event management capabilities

### Locations
- Building names and addresses
- City and country information
- Google Maps integration
- GPS coordinates

### Events
- Event details (name, description, dates, price)
- Event series information
- Location and organizer relationships
- Event sections with speakers and timing
- Website links and registration information
- Speaker assignments

## Dependencies

The seed scripts depend on the following order:
1. Bitcoiners (no dependencies)
2. Organizers (no dependencies)
3. Locations (no dependencies)
4. Events (depends on bitcoiners, organizers, and locations)

## Notes

- All scripts clear existing data before seeding
- Social media profiles are created with proper owner relationships
- Events include realistic sample data with proper relationships
- All timestamps are in Thailand timezone (UTC+7)
- Images use both local assets and Unsplash for variety

## Development

When adding new seed data:
1. Follow the existing data structure patterns
2. Ensure proper relationships between entities
3. Use realistic sample data
4. Test individual scripts before running the master script
5. Update this README if adding new scripts or changing data structure
