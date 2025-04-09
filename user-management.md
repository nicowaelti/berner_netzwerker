# User Management System

## Authentication System

### Firebase Authentication Setup
```typescript
// lib/firebase/auth.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth functions
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
```

### Auth Context
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## User Types and Roles

### User Types
1. **Regular Users (Freelancers)**
   - Personal profile
   - Availability management
   - Job application capabilities
   - Portfolio management

2. **Company Users**
   - Company profile
   - Job posting capabilities
   - Talent search
   - Event organization

3. **Administrators**
   - User management
   - Content moderation
   - System configuration
   - Analytics access

### Role Management
```typescript
// lib/firebase/roles.ts
import { db } from '@/lib/firebase/db';

export const checkUserRole = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().role : null;
};

export const updateUserRole = async (userId: string, newRole: string) => {
  await updateDoc(doc(db, 'users', userId), {
    role: newRole,
    updatedAt: serverTimestamp()
  });
};
```

## Profile Management

### Profile Creation
```typescript
// lib/firebase/profile.ts
export const createUserProfile = async (
  userId: string,
  profileType: 'freelancer' | 'company',
  profileData: any
) => {
  await setDoc(doc(db, 'users', userId), {
    ...profileData,
    profileType,
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};
```

### Profile Updates
```typescript
export const updateProfile = async (userId: string, updates: any) => {
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
};
```

## Protected Routes

### Route Protection
```typescript
// components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : null;
}
```

### Admin Route Protection
```typescript
// components/AdminRoute.tsx
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const role = await checkUserRole(user.uid);
        setIsAdmin(role === 'admin');
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
```

## Session Management

### Session Configuration
```typescript
// firebase.config.ts
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
```

### Session Tracking
```typescript
export const initializeAuthListener = () => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const token = await user.getIdToken();
      // Store token securely if needed
    } else {
      // User is signed out
      // Clean up any user-specific data
    }
  });
};
```

## Security Features

### Password Requirements
```typescript
export const validatePassword = (password: string): boolean => {
  const requirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };

  return (
    password.length >= requirements.minLength &&
    requirements.hasUpperCase &&
    requirements.hasLowerCase &&
    requirements.hasNumbers &&
    requirements.hasSpecialChar
  );
};
```

### Error Handling
```typescript
export const handleAuthError = (error: any) => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'No user found with this email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email address is already registered',
    'auth/weak-password': 'Password is too weak',
    'auth/invalid-email': 'Invalid email address',
  };

  return errorMessages[error.code] || 'An unexpected error occurred';
};
```

## Account Management

### Password Reset
```typescript
export const initiatePasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};
```

### Account Deletion
```typescript
export const deleteUserAccount = async (userId: string) => {
  try {
    // Delete user data
    await deleteDoc(doc(db, 'users', userId));
    
    // Delete user authentication
    const user = auth.currentUser;
    if (user) {
      await user.delete();
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};
```

This user management system leverages Firebase Authentication and Firestore for a secure, scalable authentication and user management solution.
