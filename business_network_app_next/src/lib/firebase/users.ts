import { db } from './config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getConnectionStatus } from './network';

import type { NetworkMember } from '@/lib/types/network';

export type UserProfile = Omit<NetworkMember, 'connectionStatus'>;

export async function getAllUsers(currentUserId: string): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('id', '!=', currentUserId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserProfile));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

export async function getNetworkMembers(currentUserId: string): Promise<NetworkMember[]> {
  try {
    const users = await getAllUsers(currentUserId);
    
    // Get connection status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const connectionStatus = await getConnectionStatus(currentUserId, user.id);
        return {
          ...user,
          connectionStatus
        };
      })
    );

    return usersWithStatus;
  } catch (error) {
    console.error('Error getting network members:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}
