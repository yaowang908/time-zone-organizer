# Time Zone Organizer

A modern time zone management application built with Next.js and shadcn/ui components.

## Features

- **Multi-timezone Management**: Add and manage multiple people across different time zones
- **Real-time Updates**: See current time across all time zones in real-time
- **Interactive Timeline**: Visual timeline showing day/night cycles for each time zone
- **Modern UI**: Beautiful, accessible interface built with shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Persists user data locally in the browser

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Time Management**: Spacetime library
- **State Management**: React hooks with local storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd time-zone-organizer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding People

- Click the "Add Person" button in the bottom-left corner
- Enter a name for the person
- Select their time zone from the dropdown

### Managing Time Zones

- Use the time zone picker to change a person's time zone
- The timeline will automatically update to show the correct day/night cycle

### Setting Local Time

- Use the datetime picker in the center of the screen to set your local time
- All other time zones will update accordingly

### Resetting Data

- Click the "Reset" button in the top-right corner
- Confirm the action to clear all saved data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── select.tsx
│   ├── Entry.component.tsx      # Individual time zone entry
│   ├── Timeline.component.tsx   # Time visualization
│   └── TimezonePicker.component.tsx # Time zone selector
├── lib/                  # Utility functions
│   ├── utils.ts          # shadcn/ui utilities
│   └── ...               # Time zone utilities
├── data/                 # Static data
│   └── timezones.tsx     # Time zone definitions
└── settings/             # Configuration
    ├── color.settings.tsx
    └── hours.setting.tsx
```

## Key Components

### shadcn/ui Components Used

- **Button**: For actions like "Add Person" and "Reset"
- **Card**: Container for time zone entries
- **Dialog**: Confirmation dialogs for destructive actions
- **Input**: Text input for names and datetime selection
- **Select**: Time zone picker with search functionality

### Custom Components

- **Entry**: Displays a person's time zone information with timeline
- **Timeline**: Visual representation of day/night cycles
- **TimezonePicker**: Enhanced select component for time zone selection

## Styling

The application uses Tailwind CSS with a custom color scheme that supports:

- Dark theme optimized for time zone visualization
- Responsive design for all screen sizes
- Accessible color contrasts
- Smooth animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New shadcn/ui Components

To add new shadcn/ui components:

1. Install the component:

```bash
npx shadcn@latest add [component-name]
```

2. Import and use in your components:

```tsx
import { ComponentName } from '@/components/ui/component-name';
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for the icon set
