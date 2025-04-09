# Security Concept

## Authentication System

### Firebase Authentication Integration
```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            ...userCredential.user
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.uid = token.uid;
      }
      return session;
    }
  }
});
```

### Protected API Routes
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return !!token;
      }
      return true;
    }
  }
});

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/jobs/:path*',
    '/profiles/:path*'
  ]
};
```

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    function isValidProfile() {
      return request.resource.data.keys().hasAll(['email', 'profileType'])
        && (request.resource.data.profileType in ['freelancer', 'company']);
    }

    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && isOwner(userId)
        && isValidProfile();
      allow update: if isAuthenticated()
        && (isOwner(userId) || hasRole('admin'))
        && isValidProfile();
      allow delete: if hasRole('admin');
    }

    // Jobs
    match /jobs/{jobId} {
      function isValidJob() {
        return request.resource.data.keys().hasAll(['title', 'description', 'type'])
          && request.resource.data.title.size() >= 3
          && request.resource.data.description.size() >= 10;
      }

      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isValidJob();
      allow update: if isAuthenticated()
        && (request.resource.data.createdBy == request.auth.uid || hasRole('admin'))
        && isValidJob();
      allow delete: if isAuthenticated()
        && (resource.data.createdBy == request.auth.uid || hasRole('admin'));
    }

    // Availability posts
    match /availabilityPosts/{postId} {
      function isValidAvailability() {
        return request.resource.data.keys().hasAll(['startDate', 'endDate'])
          && request.resource.data.startDate < request.resource.data.endDate;
      }

      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isValidAvailability();
      allow update: if isAuthenticated()
        && (resource.data.createdBy == request.auth.uid || hasRole('admin'))
        && isValidAvailability();
      allow delete: if isAuthenticated()
        && (resource.data.createdBy == request.auth.uid || hasRole('admin'));
    }

    // Events
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated()
        && (resource.data.createdBy == request.auth.uid || hasRole('admin'));
      allow delete: if isAuthenticated()
        && (resource.data.createdBy == request.auth.uid || hasRole('admin'));
    }
  }
}
```

## API Security Measures

### CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### Request Validation
```typescript
// lib/validate.ts
import { z } from 'zod';

export const JobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
  location: z.string(),
  remoteType: z.enum(['no_preference', 'remote_only', 'hybrid', 'on_site']),
  requirements: z.string(),
  salary: z.string().optional(),
  contactInfo: z.string().optional(),
});

// Usage in API route
import { JobSchema } from '@/lib/validate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = JobSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid data' });
  }
}
```

## Client-Side Security

### Protected Routes
```typescript
// components/ProtectedRoute.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return session ? children : null;
}
```

### Secure Data Fetching
```typescript
// lib/firebase-admin.ts
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDB = getFirestore();
```

## Error Handling & Logging

### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Log to error reporting service
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}
```

## Security Best Practices

### 1. Environment Variables
```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
FIREBASE_ADMIN_PROJECT_ID=xxx
FIREBASE_ADMIN_CLIENT_EMAIL=xxx
FIREBASE_ADMIN_PRIVATE_KEY=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
```

### 2. Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 3. Rate Limiting
```typescript
// pages/api/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

const getIP = (request) =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress;

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60 // limit each IP to 60 requests per windowMs
});

export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 30, // allow 30 requests per minute without delay
  delayMs: 500 // delay subsequent requests by 500ms
});
```

This security concept ensures:
- Secure authentication with Firebase
- Role-based access control
- Data validation at multiple levels
- Protected API routes
- Secure client-side data fetching
- Rate limiting and DDoS protection
- Content Security Policy implementation
- Proper error handling and logging
- Environment variable security
- CORS protection
