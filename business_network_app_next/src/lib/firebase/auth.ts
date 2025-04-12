import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { auth, db } from './config';

type UserProfile = {
  email: string;
  createdAt: string;
  profileType: 'company' | 'freelancer';
  role: 'user' | 'admin';
  companyName?: string;
  industry?: string;
  companySize?: string;
  yearEstablished?: string;
  website?: string;
  services?: string;
  products?: string;
  name?: string;
  title?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  portfolio?: string;
  updatedAt?: string;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await getUserProfile(result.user.uid);
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  userType: 'company' | 'freelancer'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    const initialProfile: UserProfile = {
      email,
      createdAt: new Date().toISOString(),
      profileType: userType,
      role: 'user',
      ...(userType === 'company' ? {
        companyName: '',
        industry: '',
        companySize: '',
        yearEstablished: '',
        website: '',
        services: '',
        products: ''
      } : {
        name: '',
        title: '',
        location: '',
        skills: [],
        experience: '',
        education: '',
        portfolio: ''
      })
    };

    await setDoc(doc(db, 'users', userId), initialProfile);
    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<(UserProfile & { id: string })[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as UserProfile
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
  try {
    await setDoc(doc(db, 'users', userId), {
      role: newRole,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUserData = async (userId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

export const resetUserPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export { auth, db };
