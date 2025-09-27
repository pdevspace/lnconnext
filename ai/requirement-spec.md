# Requirement Specification

## Project Overview

**LNConnext** is a modern Bitcoin event tracker application designed for the Bitcoin community in Thailand. The application helps users discover, track, and manage Bitcoin events, meetups, and community gatherings.

### Functional Requirements

#### Core Content Management
- **Content Discovery**: Users can browse and search through Bitcoin events and online content
- **Content Details**: Comprehensive information including descriptions, dates, locations, speakers, pricing, and video links
- **Content Status Tracking**: Real-time status indicators (Live, Upcoming, Past, Available)
- **Content Search & Filtering**: Search by content name, description, speakers, locations, or creators
- **Content Series Support**: Track recurring events and multi-part content series

#### Activity Types and Categories
- **Offline Event**: Physical events and meetups
  - **Bitcoin Meetups**: Informal gatherings for Bitcoiners to discuss Bitcoin topics
  - **Conferences**: Formal events with speaker presentations and knowledge sharing
  - **Courses**: Educational sessions with limited seats requiring ticket purchase
- **Online Content**: Digital content and video series
  - **Original YouTube Content**: Single video clips on creator's own YouTube channel
  - **YouTube Series**: Multi-part video series on creator's own YouTube channel
  - **Guest Appearances**: Creator appearing as guest on other YouTube channels

#### Content Organization and Display
- **Time-based Ordering**: All content sorted by chronological order (newest first)
- **Owner Filtering**: Filter content by content creator/organizer
- **Dual View Modes**: Both list view and calendar view for all content types
- **Content Type Filtering**: Filter by offline vs online content categories

#### Activity Interaction Features
- **Save Activities**: Bookmark events and content for later reference
- **Share Activities**: Native sharing or copy link functionality
- **Calendar Integration**: Add events to Google Calendar with one click (offline events only)
- **Website Links**: Direct access to event registration, information pages, and original content sources
- **Activity Details**: Comprehensive view of all activity information

#### Organizer Management
- **Organizer Profiles**: View organizer information and their events
- **Organizer Event History**: Track past and upcoming events by organizer
- **Organizer Social Media**: Links to organizer social media profiles

#### Calendar System
- **Monthly Calendar View**: Traditional calendar grid showing events by date
- **Daily Calendar View**: List view of events for selected dates
- **Event Navigation**: Navigate between months and weeks
- **Event Filtering**: Filter events by search criteria

#### User Interface
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Modern UI**: Clean, modern design with excellent typography
- **Navigation**: Fixed navigation bar (60px height) with main sections (Events, Organizers, Calendar, Info)
- **Status Indicators**: Visual indicators for event status and upcoming events
- **Activity Management**: Each activity (event/content) has save button, calendar integration, website links, and details view

### Non-Functional Requirements

#### Performance Requirements
- **Fast Loading**: Application loads quickly on both mobile and desktop
- **Optimized Images**: Images are optimized and served with fallbacks
- **Efficient Rendering**: Optimized React rendering for smooth user experience
- **Static Export**: Support for static site generation for deployment

#### Usability Requirements
- **Mobile-First Design**: Responsive design that works on all devices
- **Progressive Web App (PWA)**: Mobile web app with native app-like experience
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Intuitive Navigation**: Clear navigation structure and user flow
- **Search Functionality**: Easy-to-use search and filtering capabilities

#### Compatibility Requirements
- **Modern Browsers**: Support for modern web browsers
- **Mobile Devices**: Full functionality on mobile devices
- **Static Deployment**: Compatible with GitHub Pages and Vercel deployment

### Technical Requirements

#### Technology Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui components with Radix UI
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React
- **Date Handling**: date-fns library
- **Package Manager**: Yarn

#### Server-Side Rendering (SSR) Requirements
- **Static Generation**: Use Next.js static generation for content pages
- **Server Components**: Implement server-side rendering for content-heavy sections
- **SEO Optimization**: Server-rendered content for better search engine optimization
- **Performance**: Leverage SSR for faster initial page loads
- **Data Fetching**: Server-side data fetching for content and metadata

#### Data Management
- **Static Data**: JSON-based event and content data storage
- **Data Services**: Service layer for data access and manipulation
- **Type Safety**: Full TypeScript type definitions for all data structures
- **Content Data**: Separate data structures for offline and online content
- **YouTube Integration**: YouTube API integration for video metadata and thumbnails
- **Activity Management**: Create new activities by adding JSON files and redeploying
- **Lightning Integration**: Lightning address support (lnconnext@lnconnext.vercel.app) with .well-known/lnurlp configuration

#### Deployment Requirements
- **Static Export**: Support for static site generation
- **GitHub Pages**: Compatible with GitHub Pages deployment
- **Vercel**: Optimized for Vercel deployment
- **Build Process**: Automated build and export process

#### Progressive Web App (PWA) Requirements
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: App-like installation and display
- **Offline Support**: Basic offline functionality for cached content
- **Push Notifications**: Optional notifications for new content
- **App Shell**: Fast loading app shell architecture
- **Mobile Optimization**: Touch-friendly interface and mobile-specific features

### Constraints

#### Technical Constraints
- **Static Data**: No backend database - all data stored in JSON files
- **Client-Side Only**: No server-side functionality required
- **Static Export**: Must support static site generation
- **TypeScript**: All code must be written in TypeScript

#### Content Constraints
- **Bitcoin Focus**: Application specifically for Bitcoin-related events
- **Thailand Community**: Primarily serves the Bitcoin community in Thailand
- **Event Data**: Manual data entry and management required

## Acceptance Criteria

### Core Functionality
- [x] Users can view a list of all Bitcoin events
- [x] Users can search and filter events
- [x] Users can view detailed event information
- [x] Users can navigate to organizer profiles
- [x] Users can view events in calendar format
- [x] Application works on mobile and desktop devices
- [x] Navigation bar is 60px height
- [x] Each activity has save button, calendar integration, website links, and details view
- [x] Lightning address integration (lnconnext@lnconnext.vercel.app)
- [ ] Users can view offline content (meetups, conferences, courses)
- [ ] Users can view online content (YouTube videos and series)
- [ ] Users can filter content by type (offline vs online)
- [ ] Users can filter content by owner/creator
- [ ] Content is sorted by chronological order
- [ ] Both list and calendar views support all content types
- [ ] New activities can be added by creating JSON files and redeploying

### User Experience
- [x] Application loads quickly and smoothly
- [x] Navigation is intuitive and responsive
- [x] Event information is clearly displayed
- [x] Search functionality works effectively
- [x] Calendar navigation is smooth and functional
- [ ] Mobile-first design provides excellent mobile experience
- [ ] Progressive Web App features work correctly
- [ ] Offline functionality works for cached content
- [ ] App can be installed on mobile devices

### Technical Implementation
- [x] Application builds successfully for production
- [x] Static export works correctly
- [x] All TypeScript types are properly defined
- [x] Responsive design works across devices
- [x] Performance is optimized for static deployment
- [ ] Server-side rendering is implemented for content pages
- [ ] Progressive Web App manifest and service worker are configured
- [ ] YouTube API integration is implemented
- [ ] Content data structures support both offline and online content
- [ ] TypeScript types are defined for all new content types

## Stakeholder Requirements

### Primary Users (Bitcoin Community in Thailand)
- **Event Discovery**: Need to easily find Bitcoin events and meetups
- **Event Information**: Require comprehensive event details including speakers, locations, and schedules
- **Community Connection**: Want to connect with organizers and other community members
- **Mobile Access**: Need mobile-friendly access to event information
- **Content Discovery**: Need to discover both offline events and online content
- **Mobile App Experience**: Want native app-like experience on mobile devices
- **Offline Access**: Need access to cached content when offline

### Event Organizers and Content Creators
- **Event Visibility**: Need their events to be easily discoverable
- **Event Management**: Require ability to provide comprehensive event information
- **Community Engagement**: Want to connect with the Bitcoin community
- **Social Media Integration**: Need links to their social media and websites
- **Content Visibility**: Need their online content (YouTube videos, series) to be discoverable
- **Content Management**: Require ability to showcase both offline events and online content
- **Audience Engagement**: Want to reach both event attendees and online viewers

### Developers/Contributors
- **Open Source**: Want to contribute to an open source project
- **Modern Tech Stack**: Prefer modern, maintainable technology
- **Easy Contribution**: Need clear contribution guidelines and processes
- **Documentation**: Require comprehensive documentation for development

---

*This document serves as the foundation for the design and implementation phases. All design decisions should trace back to these requirements.*
