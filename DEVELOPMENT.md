# Development Guide

## Project Structure

```
src/
├── components/          # React components
│   ├── ValuationCalculator.tsx    # Main calculator container
│   ├── ValuationForm.tsx          # Input form component
│   └── ValuationResults.tsx       # Results display component
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── valuationCalculator.ts     # Valuation logic
├── App.tsx             # Main app component
├── main.tsx            # React entry point
├── index.css           # Global styles with Viberank design system
└── vite-env.d.ts       # Vite type definitions
```

## Viberank Design System Integration

The application implements the complete Viberank design system:

### Colors
- **Primary**: Blue-gray scale (50-950) for backgrounds and neutral elements
- **Secondary**: Teal scale (50-950) for interactive elements and highlights  
- **Accent**: Orange scale (50-950) for call-to-action buttons and emphasis

### Key Features
- Dark-mode-first design (`class="dark"` on HTML)
- Custom animations (fade-in, slide-up, shimmer)
- Tailwind CSS with extended color palette
- Inter font family with proper font weights
- Responsive design with mobile-first approach

### Custom CSS Classes
- `.card-hover-effect` - Hover animations for cards
- `.vote-button` - Interactive button animations
- `.scrollbar-hide` - Hidden scrollbars utility
- `.line-clamp-1/2` - Text truncation utilities

## Component Architecture

### ValuationCalculator (Main Container)
- Manages application state
- Coordinates between form and results
- Handles calculation triggering

### ValuationForm
- Comprehensive input form with validation
- Organized into logical sections:
  - Financial Performance (MRR, MRP)
  - User Traction (visitors, registrations, category)
  - Social Media (followers across platforms)
- Real-time validation with error messages
- Loading states with animations

### ValuationResults
- Displays valuation range prominently
- Shows methodology breakdown for each approach
- Confidence analysis with visual scoring
- Key insights and recommendations
- Action buttons (reset, print)

## Valuation Methods

1. **Revenue-Based**: ARR × growth-adjusted multiple (3x-10x)
2. **User-Based**: Active users × category-specific value ($5-$25/user)
3. **Cost-Based**: Development hours × country hourly rate
4. **Social Media**: Followers × platform value ($1.50-$3/follower)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Key Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon components

## State Management

The application uses React's built-in state management:
- `useState` for form data and results
- Props drilling for component communication
- No external state management library needed

## Styling Approach

- **Utility-first** with Tailwind CSS
- **Responsive design** with mobile breakpoints
- **Dark theme** as default with light mode support
- **Custom animations** for smooth UX
- **Component-scoped** hover and focus states

## Performance Considerations

- **Lazy calculation** with simulated delay for better UX
- **Optimized bundle** size with Vite tree-shaking
- **Efficient re-renders** with proper React patterns
- **Responsive images** and SVG icons
- **Minimal dependencies** for fast loading

## Browser Support

- Chrome 88+
- Firefox 85+  
- Safari 14+
- Edge 88+

Modern browsers with ES2020 support required.
