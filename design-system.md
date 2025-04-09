# Design System

## Brand Identity

### Logo & Branding
```
Font: Cal Sans
Primary Color: #0070F3 (Blue 600)
Secondary Colors: #10B981 (Mint), #8B5CF6 (Lavender)
```

### Design Principles
- Clean and minimal
- Generous white space
- Subtle shadows and depth
- Smooth interactions
- Consistent spacing

## Color System

### Primary Colors
```css
/* Blue - Primary Brand Color */
.blue-50  { color: #F0F7FF; } /* Background, hover states */
.blue-100 { color: #E0EFFF; } /* Light backgrounds */
.blue-200 { color: #B8DBFF; } /* Borders, dividers */
.blue-300 { color: #8AC2FF; } /* Icons, accents */
.blue-400 { color: #5CA8FF; } /* Secondary text */
.blue-500 { color: #2E8EFF; } /* Primary text */
.blue-600 { color: #0070F3; } /* Primary actions */
.blue-700 { color: #0058CC; } /* Hover states */
.blue-800 { color: #004299; } /* Active states */
.blue-900 { color: #002B66; } /* Dark text */
```

### Neutral Colors
```css
/* Gray - Interface Colors */
.gray-50  { color: #F9FAFB; } /* Page background */
.gray-100 { color: #F3F4F6; } /* Card background */
.gray-200 { color: #E5E7EB; } /* Borders */
.gray-300 { color: #D1D5DB; } /* Disabled state */
.gray-400 { color: #9CA3AF; } /* Placeholder text */
.gray-500 { color: #6B7280; } /* Secondary text */
.gray-600 { color: #4B5563; } /* Primary text */
.gray-700 { color: #374151; } /* Headings */
.gray-800 { color: #1F2937; } /* Strong text */
.gray-900 { color: #111827; } /* Extra bold text */
```

### Status Colors
```css
/* Semantic Colors */
.success { color: #10B981; } /* Success states */
.error   { color: #F43F5E; } /* Error states */
.warning { color: #FBBF24; } /* Warning states */
.info    { color: #60A5FA; } /* Info states */
```

## Typography

### Font Families
```css
/* Primary Font */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Display Font */
font-family: 'Cal Sans', 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
```css
/* Headings */
h1 { 
  font-size: 2.25rem;   /* 36px */
  line-height: 2.5rem;  /* 40px */
  font-weight: 700;
}

h2 { 
  font-size: 1.875rem; /* 30px */
  line-height: 2.25rem; /* 36px */
  font-weight: 700;
}

h3 { 
  font-size: 1.5rem;   /* 24px */
  line-height: 2rem;   /* 32px */
  font-weight: 600;
}

/* Body Text */
body {
  font-size: 1rem;     /* 16px */
  line-height: 1.5rem; /* 24px */
  font-weight: 400;
}

/* Small Text */
small {
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
}
```

## Component Library

### Buttons

#### Primary Button
```jsx
<button className="
  px-4 py-2 
  bg-blue-600 
  text-white 
  rounded-lg
  font-medium
  hover:bg-blue-700 
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-500 
  focus:ring-offset-2
  transition-colors
">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="
  px-4 py-2 
  bg-white 
  text-gray-700
  border border-gray-200
  rounded-lg
  font-medium
  hover:bg-gray-50
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-500 
  focus:ring-offset-2
  transition-colors
">
  Secondary Action
</button>
```

### Cards

#### Job Card
```jsx
<div className="
  group
  relative
  bg-white
  rounded-xl
  shadow-sm
  hover:shadow-md
  p-6
  transition-all
  duration-200
">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Job Title</h3>
      <p className="text-gray-500 mt-1">Company Name</p>
    </div>
    <span className="
      inline-flex 
      items-center 
      px-2.5 
      py-0.5 
      rounded-full 
      text-xs 
      font-medium 
      bg-blue-100 
      text-blue-800
    ">
      Full-time
    </span>
  </div>
  
  <div className="mt-4">
    <p className="text-gray-600">Job description preview...</p>
  </div>
  
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center space-x-1 text-gray-500">
      <MapPinIcon className="h-4 w-4" />
      <span className="text-sm">Location</span>
    </div>
    <button className="
      text-blue-600 
      hover:text-blue-700 
      font-medium 
      text-sm
    ">
      View Details →
    </button>
  </div>
</div>
```

### Form Elements

#### Text Input
```jsx
<div className="space-y-1">
  <label 
    htmlFor="email" 
    className="block text-sm font-medium text-gray-700"
  >
    Email
  </label>
  <input
    type="email"
    id="email"
    className="
      block 
      w-full 
      rounded-lg 
      border-gray-200 
      shadow-sm 
      focus:border-blue-500 
      focus:ring-blue-500 
      sm:text-sm
    "
  />
</div>
```

#### Select Menu
```jsx
<div className="space-y-1">
  <label 
    htmlFor="category" 
    className="block text-sm font-medium text-gray-700"
  >
    Category
  </label>
  <select
    id="category"
    className="
      block 
      w-full 
      rounded-lg 
      border-gray-200 
      shadow-sm 
      focus:border-blue-500 
      focus:ring-blue-500 
      sm:text-sm
    "
  >
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</div>
```

### Navigation

#### Top Navigation
```jsx
<nav className="
  fixed 
  top-0 
  z-50 
  w-full 
  bg-white/80 
  backdrop-blur-sm 
  border-b 
  border-gray-200
">
  <div className="
    mx-auto 
    max-w-7xl 
    px-4 
    sm:px-6 
    lg:px-8
  ">
    <div className="flex h-16 justify-between items-center">
      <div className="flex items-center">
        <Logo className="h-8 w-auto" />
      </div>
      
      <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
        <NavLink>Dashboard</NavLink>
        <NavLink>Jobs</NavLink>
        <NavLink>Profiles</NavLink>
        <NavLink>Events</NavLink>
      </div>
      
      <div className="flex items-center space-x-4">
        <UserMenu />
      </div>
    </div>
  </div>
</nav>
```

## Spacing System

### Grid System
```css
/* Container Max Widths */
.container-sm   { max-width: 640px; }
.container-md   { max-width: 768px; }
.container-lg   { max-width: 1024px; }
.container-xl   { max-width: 1280px; }
.container-2xl  { max-width: 1536px; }

/* Grid Gaps */
.gap-xs  { gap: 0.5rem; }  /*  8px */
.gap-sm  { gap: 1rem; }    /* 16px */
.gap-md  { gap: 1.5rem; }  /* 24px */
.gap-lg  { gap: 2rem; }    /* 32px */
.gap-xl  { gap: 2.5rem; }  /* 40px */
```

### Spacing Scale
```css
/* Margin and Padding */
.space-1  { margin: 0.25rem; }  /*  4px */
.space-2  { margin: 0.5rem; }   /*  8px */
.space-3  { margin: 0.75rem; }  /* 12px */
.space-4  { margin: 1rem; }     /* 16px */
.space-6  { margin: 1.5rem; }   /* 24px */
.space-8  { margin: 2rem; }     /* 32px */
.space-12 { margin: 3rem; }     /* 48px */
.space-16 { margin: 4rem; }     /* 64px */
```

## Animation System

### Transitions
```css
/* Duration */
.duration-100 { transition-duration: 100ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }

/* Timing Functions */
.ease-in-out  { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
.ease-out     { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.ease-in      { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
```

### Hover Effects
```css
/* Card Hover */
.hover-lift {
  transition: transform 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Button Hover */
.hover-grow {
  transition: transform 0.15s ease;
}
.hover-grow:hover {
  transform: scale(1.02);
}
```

## Responsive Design

### Breakpoints
```css
/* Breakpoint System */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Media Queries
```css
/* Example Usage */
@media (min-width: 640px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 1024px) { /* Large devices */ }
@media (min-width: 1280px) { /* Extra large devices */ }
@media (min-width: 1536px) { /* 2X Extra large devices */ }
