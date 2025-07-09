# LNConnext - Bitcoin Event Tracker

A modern Next.js React TypeScript Bitcoin event tracker application designed for the Bitcoin community in Thailand. The app helps users discover and track Bitcoin events, meetups, and community gatherings.

## 🎯 Features

### Event Details Page

- **Comprehensive Event Information**: Complete event details with descriptions, dates, locations, and capacity
- **Speaker Lineup**: Grid view of featured speakers with photos, titles, and expertise
- **Interactive Schedule**: Timeline view of all event sections with personal schedule builder
- **Venue Information**: Detailed venue details, amenities, and transportation options
- **Decision Support Tools**: "Why Attend" highlights and similar events recommendations
- **Event Series Navigation**: Track recurring events (yearly, monthly, weekly)
- **Real-time Status**: Live indicators for ongoing, upcoming, and past events

### Key Interactions

- **Save Events**: Bookmark events for later reference
- **Share Events**: Share event details via native sharing or copy link
- **Calendar Integration**: Add events to Google Calendar with one click
- **Personal Schedule**: Build your own schedule by adding/removing sessions
- **Speaker Following**: Follow favorite speakers across events
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Technical Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui components with Radix UI
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React
- **Date Handling**: date-fns library
- **Package Manager**: Yarn (enforced)
- **Deployment**: GitHub Pages with static export

## 📁 Project Structure

```
lnconnext/
├── app/                          # Next.js app directory
│   ├── calendar/                 # Calendar page
│   ├── event/                    # Event pages
│   │   └── [eventId]/           # Dynamic event details
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main dashboard page
├── components/                   # React components
│   ├── pages/                   # Page-specific components
│   │   ├── calendar/            # Calendar components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── event/               # Event components
│   │   └── online-content/      # Online content components
│   └── Navbar.tsx               # Navigation component
├── lib/                         # Utility functions
│   ├── calendar-utils.ts        # Calendar utilities
│   └── utils.ts                 # Common utilities
├── types/                       # TypeScript type definitions
│   ├── calendar.ts              # Calendar types
│   ├── event.ts                 # Event types
├── public/                      # Static assets
│   └── images/                  # Event images
└── .github/workflows/           # GitHub Actions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.22.0+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lnconnext
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Run the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Deployment

### GitHub Pages

This project is configured for deployment to GitHub Pages with the base path `/lnconnext`.

#### Manual Deployment

```bash
# Build and export the project
yarn build

# The built files will be in the `out` directory
# Upload the contents of `out` to your GitHub Pages branch
```

#### Setup GitHub Pages

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (or your preferred branch)
   - Folder: `/ (root)`
2. **Your site will be available at**: `https://yourusername.github.io/lnconnext/`

### Local Build Testing

```bash
# Test the production build locally
yarn build
yarn start
```

## 🧹 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production (static export)
- `yarn clean` - Remove all generated files (node_modules, lock files, build outputs)
- `yarn deploy` - Build, export, and prepare for deployment

## 🎨 Design Features

- **Modern UI**: Clean, modern design with excellent typography
- **Dark Mode Support**: CSS variables for easy theme switching
- **Mobile-First**: Responsive design that works on all devices
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized images and efficient rendering
- **Clickable Locations**: Direct Google Maps integration
- **Event Links**: Direct links to event websites and social media

## 🔧 Customization

### Adding New Events

1. Create new event data in `data/mock-bitcoin-events.ts`
2. Follow the `Event` interface structure
3. Add images to the `public/images/` directory
4. Use proper image paths: `/images/your-image.jpg`

### Adding Event Images

1. Place images in `public/images/` directory
2. Use the exact filename in your event data
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
4. Images are automatically optimized and served with fallbacks

### Styling

- Modify `app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize component styles in individual component files

### Components

- All UI components are in `components/ui/`
- Page-specific components are in `components/pages/`
- Add new components following the existing patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
