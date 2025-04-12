import { db } from './config';
import { doc, collection, setDoc, deleteDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

export interface NetworkConnection {
  status: 'pending' | 'connected';
  createdAt: Date;
  updatedAt: Date;
}

export async function sendConnectionRequest(fromUserId: string, toUserId: string) {
  try {
    const connectionRef = doc(db, 'connections', `${fromUserId}_${toUserId}`);
    await setDoc(connectionRef, {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;
  }
}

export async function acceptConnectionRequest(fromUserId: string, toUserId: string) {
  try {
    const connectionRef = doc(db, 'connections', `${fromUserId}_${toUserId}`);
    await setDoc(connectionRef, {
      status: 'connected',
      updatedAt: new Date(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error accepting connection request:', error);
    throw error;
  }
}

export async function removeConnection(userId1: string, userId2: string) {
  try {
    // Try both possible combinations of the connection ID
    const connectionRef1 = doc(db, 'connections', `${userId1}_${userId2}`);
    const connectionRef2 = doc(db, 'connections', `${userId2}_${userId1}`);
    
    const doc1 = await getDoc(connectionRef1);
    const doc2 = await getDoc(connectionRef2);

    if (doc1.exists()) {
      await deleteDoc(connectionRef1);
    } else if (doc2.exists()) {
      await deleteDoc(connectionRef2);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing connection:', error);
    throw error;
  }
}

export async function getConnectionStatus(userId1: string, userId2: string) {
  try {
    // Check both possible combinations of the connection ID
    const connectionRef1 = doc(db, 'connections', `${userId1}_${userId2}`);
    const connectionRef2 = doc(db, 'connections', `${userId2}_${userId1}`);
    
    const doc1 = await getDoc(connectionRef1);
    const doc2 = await getDoc(connectionRef2);

    if (doc1.exists()) {
      return doc1.data().status;
    } else if (doc2.exists()) {
      return doc2.data().status;
    }
    
    return 'none';
  } catch (error) {
    console.error('Error getting connection status:', error);
    throw error;
  }
}

export async function getUserConnections(userId: string) {
  try {
    const connectionsRef = collection(db, 'connections');
    const q1 = query(connectionsRef, where('fromUserId', '==', userId));
    const q2 = query(connectionsRef, where('toUserId', '==', userId));
    
    const [sent, received] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    const connections = new Map();

    sent.forEach((doc) => {
      const data = doc.data();
      connections.set(data.toUserId, data);
    });

    received.forEach((doc) => {
      const data = doc.data();
      connections.set(data.fromUserId, data);
    });

    return Array.from(connections.values());
  } catch (error) {
    console.error('Error getting user connections:', error);
    throw error;
  }
}
