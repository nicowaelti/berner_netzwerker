# UI Components Documentation

## Layout Structure

### Main Layout Component
Located in `src/components/Layout.jsx`, the main layout includes:

- Responsive sidebar navigation
- Mobile hamburger menu
- User profile section
- Footer with Impressum link
- Content area wrapper

```jsx
<div className="min-h-screen bg-gray-100 flex flex-col">
  {/* Sidebar */}
  {/* Main Content */}
  {/* Footer */}
</div>
```

## Navigation System

### Desktop Navigation
- Persistent sidebar
- Logo and app title
- Main navigation links
- User profile section
- Logout button

### Mobile Navigation
- Collapsible sidebar
- Hamburger menu trigger
- Overlay background
- Animated transitions
- Touch-friendly targets

### Navigation Items
```javascript
const navigation = [
  { name: 'Übersicht', href: '/dashboard', icon: HomeIcon },
  { name: 'Projekte', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Verfügbare Kapazitäten', href: '/availability-posts', icon: ClockIcon },
  { name: 'Veranstaltungen', href: '/events', icon: CalendarIcon },
  { name: 'Mitglieder', href: '/companies', icon: UserGroupIcon },
];
```

## Common Components

### Cards
- Job postings
- Availability posts
- Profile cards
- Event cards

```jsx
<div className="bg-white shadow rounded-lg p-6">
  <div className="space-y-4">
    {/* Card content */}
  </div>
</div>
```

### Forms
- Registration forms
- Profile editing
- Job posting creation
- Availability posting

```jsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {/* Label */}
    </label>
    <input
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      {/* Input props */}
    />
  </div>
</form>
```

### Buttons
- Primary action buttons
- Secondary buttons
- Icon buttons
- Link buttons

```jsx
// Primary Button
<button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
  {/* Button content */}
</button>

// Secondary Button
<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
  {/* Button content */}
</button>
```

### Lists
- User lists
- Job listings
- Event listings
- Navigation lists

```jsx
<div className="space-y-6">
  {items.map((item) => (
    <div key={item.id} className="bg-white shadow rounded-lg p-6">
      {/* List item content */}
    </div>
  ))}
</div>
```

## Styling System

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Custom configuration
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

### Color Scheme
- Primary: Indigo (`bg-indigo-600`)
- Secondary: Gray (`bg-gray-100`)
- Success: Green (`bg-green-500`)
- Error: Red (`bg-red-500`)
- Warning: Yellow (`bg-yellow-500`)

### Typography
- Headers: Font medium/bold, larger sizes
- Body: Regular weight, comfortable line height
- Labels: Smaller text, medium weight
- Links: Colored text with hover states

### Spacing System
- Consistent padding and margins
- Responsive spacing utilities
- Grid gap settings
- Component spacing

## Responsive Design

### Breakpoints
```css
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
2xl: 1536px // 2X Extra large devices
```

### Responsive Patterns
```jsx
// Example of responsive classes
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-4
  p-4
  sm:p-6
  lg:p-8
">
  {/* Content */}
</div>
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly elements
- Optimized images and assets

## Loading States

### Loading Indicators
```jsx
// Spinner component
<div className="flex justify-center items-center">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">
  </div>
</div>
```

### Skeleton Loaders
```jsx
// Skeleton loading state
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="space-y-3 mt-4">
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
</div>
```

## Icons

### Icon Systems
- Heroicons for UI elements
- React Icons for additional icons
- Consistent sizing
- Color inheritance

```jsx
import { HomeIcon } from '@heroicons/react/24/outline';
import { MdEmail } from 'react-icons/md';

// Usage
<HomeIcon className="h-6 w-6 text-gray-500" />
<MdEmail className="h-6 w-6 text-gray-500" />
```

## Accessibility

### ARIA Attributes
- Proper labeling
- Role definitions
- State descriptions
- Focus management

### Keyboard Navigation
- Focus indicators
- Tab ordering
- Keyboard shortcuts
- Modal handling

### Color Contrast
- WCAG 2.1 compliant
- High contrast modes
- Text legibility
- Interactive element distinction
