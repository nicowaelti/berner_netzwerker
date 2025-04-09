# Firebase/Firestore Database Schema

## Collections Structure

### users
```typescript
interface User {
  id: string;            // Auth UID
  email: string;
  profileType: 'freelancer' | 'company';
  role: 'user' | 'admin';
  emailVerified: boolean;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Freelancer-specific fields (if profileType === 'freelancer')
  name?: string;
  title?: string;
  location?: string;
  bio?: string;
  experience?: string;
  education?: string;
  portfolio?: string;
  skills?: string[];     // Array of skill IDs

  // Company-specific fields (if profileType === 'company')
  companyName?: string;
  industry?: string;
  companySize?: string;
  yearEstablished?: string;
  website?: string;
  description?: string;
  services?: string;
  products?: string;
}
```

### jobs
```typescript
interface Job {
  id: string;           // Auto-generated
  createdBy: string;    // Reference to user ID
  companyName: string;
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  location: string;
  remoteType: 'no_preference' | 'remote_only' | 'hybrid' | 'on_site';
  description: string;
  requirements: string;
  salary?: string;
  contactInfo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### availabilityPosts
```typescript
interface AvailabilityPost {
  id: string;           // Auto-generated
  userId: string;       // Reference to user ID
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### events
```typescript
interface Event {
  id: string;           // Auto-generated
  createdBy: string;    // Reference to user ID
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  maxAttendees?: number;
  attendees: string[];  // Array of user IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### savedJobs
```typescript
interface SavedJob {
  id: string;           // Auto-generated
  userId: string;       // Reference to user ID
  jobId: string;        // Reference to job ID
  createdAt: Timestamp;
}
```

### notifications
```typescript
interface Notification {
  id: string;           // Auto-generated
  userId: string;       // Reference to user ID
  type: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}
```

## Data Access Patterns

### User Management
```typescript
// Create a new user profile
const createUser = async (userId: string, userData: Partial<User>) => {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Get user profile
const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() : null;
};

// Update user profile
const updateUser = async (userId: string, updates: Partial<User>) => {
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};
```

### Job Management
```typescript
// Create a new job
const createJob = async (jobData: Partial<Job>) => {
  const jobRef = doc(collection(db, 'jobs'));
  await setDoc(jobRef, {
    ...jobData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return jobRef.id;
};

// Query jobs with filters
const queryJobs = async (filters: JobFilters) => {
  let q = collection(db, 'jobs');
  
  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }
  
  if (filters.location) {
    q = query(q, where('location', '==', filters.location));
  }
  
  q = query(q, orderBy('createdAt', 'desc'), limit(20));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

## Security Rules

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

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && (isOwner(userId) || hasRole('admin'));
      allow delete: if hasRole('admin');
    }

    // Jobs collection
    match /jobs/{jobId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        (resource.data.createdBy == request.auth.uid || hasRole('admin'));
    }

    // Availability posts
    match /availabilityPosts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        (resource.data.userId == request.auth.uid || hasRole('admin'));
    }

    // Events
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        (resource.data.createdBy == request.auth.uid || hasRole('admin'));
    }
  }
}
```

## Indexing

### Single-Field Indexes
```javascript
// Required indexes
users: ['profileType', 'role', 'email']
jobs: ['type', 'location', 'createdAt']
availabilityPosts: ['userId', 'startDate', 'endDate']
events: ['date', 'location']
```

### Compound Indexes
```javascript
// Required composite indexes
jobs: ['type', 'location', 'createdAt']
availabilityPosts: ['userId', 'startDate']
events: ['createdBy', 'date']
```

## Best Practices

### 1. Document Size
- Keep documents under 1MB
- Use subcollections for large nested data
- Store large text fields separately if needed
- Use cloud storage for files/images

### 2. Query Optimization
- Create indexes for common queries
- Use composite indexes for complex queries
- Limit query results
- Use cursors for pagination

### 3. Data Structure
- Denormalize data when necessary
- Use atomic operations for updates
- Keep references consistent
- Handle offline data

### 4. Security
- Validate data on write
- Use security rules for access control
- Implement role-based access
- Sanitize user input

## Firebase Configuration

```typescript
// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## Data Validation

### Client-Side Validation
```typescript
import * as z from 'zod';

export const JobSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
  location: z.string(),
  remoteType: z.enum(['no_preference', 'remote_only', 'hybrid', 'on_site']),
  description: z.string().min(10),
  requirements: z.string(),
  salary: z.string().optional(),
  contactInfo: z.string().optional(),
});
```

### Server-Side Rules
```javascript
// Firestore Security Rules validation
function isValidJob() {
  return request.resource.data.keys().hasAll(['title', 'type', 'location']) &&
         request.resource.data.title.size() >= 3 &&
         request.resource.data.type in ['full-time', 'part-time', 'contract', 'freelance'];
}
```

This schema provides a solid foundation for the application while leveraging Firebase's real-time capabilities and security features.
