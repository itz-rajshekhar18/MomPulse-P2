import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  currentStage?: 'planning' | 'postpartum' | 'pregnancy' | 'period';
  age?: number;
  onboardingCompleted?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Onboarding data interface
export interface OnboardingData {
  currentStage: 'planning' | 'postpartum' | 'pregnancy' | 'period';
  age?: number;
  completedAt: Timestamp;
}

// Create or update user profile
export async function createUserProfile(
  userId: string, 
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    ...data,
    uid: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
}

// Save onboarding data
export async function saveOnboardingData(
  userId: string,
  data: OnboardingData
): Promise<void> {
  const onboardingRef = doc(db, 'users', userId, 'onboarding', 'initial');
  
  await setDoc(onboardingRef, {
    ...data,
    completedAt: serverTimestamp(),
  });
  
  // Also update the main user document
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    currentStage: data.currentStage,
    age: data.age || null,
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  });
}

// Get onboarding data
export async function getOnboardingData(userId: string): Promise<OnboardingData | null> {
  const onboardingRef = doc(db, 'users', userId, 'onboarding', 'initial');
  const onboardingSnap = await getDoc(onboardingRef);
  
  if (onboardingSnap.exists()) {
    return onboardingSnap.data() as OnboardingData;
  }
  
  return null;
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Check if user has completed onboarding
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData.onboardingCompleted === true;
  }
  
  return false;
}

// AI Conversation interfaces
export interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  createdAt: Timestamp;
  isInsight?: boolean;
  actionCard?: {
    title: string;
    description: string;
    icon: string;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  stage: string;
  messages: Message[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Save a message to the conversation
export async function saveMessage(
  userId: string,
  conversationId: string,
  message: Omit<Message, 'createdAt'>
): Promise<void> {
  const messageRef = doc(
    db,
    'users',
    userId,
    'conversations',
    conversationId,
    'messages',
    message.id
  );

  await setDoc(messageRef, {
    ...message,
    createdAt: serverTimestamp(),
  });

  // Update conversation's updatedAt timestamp
  const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    updatedAt: serverTimestamp(),
    lastMessage: message.message,
    lastMessageTime: serverTimestamp(),
  });
}

// Get all messages from a conversation
export async function getConversationMessages(
  userId: string,
  conversationId: string
): Promise<Message[]> {
  const messagesRef = collection(
    db,
    'users',
    userId,
    'conversations',
    conversationId,
    'messages'
  );

  const { getDocs, query, orderBy } = await import('firebase/firestore');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);

  const messages: Message[] = [];
  querySnapshot.forEach((doc) => {
    messages.push(doc.data() as Message);
  });

  return messages;
}

// Create or get current conversation
export async function getCurrentConversation(
  userId: string,
  stage: string
): Promise<string> {
  // Use stage-specific conversation ID
  const conversationId = `${stage.toLowerCase().replace(/\s+/g, '-')}-current`;
  const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (!conversationSnap.exists()) {
    // Create new conversation
    await setDoc(conversationRef, {
      id: conversationId,
      userId,
      stage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return conversationId;
}

// Get conversation by ID
export async function getConversation(
  userId: string,
  conversationId: string
): Promise<Conversation | null> {
  const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (conversationSnap.exists()) {
    const data = conversationSnap.data();
    const messages = await getConversationMessages(userId, conversationId);
    
    return {
      ...data,
      messages,
    } as Conversation;
  }

  return null;
}

// Clear conversation (delete all messages)
export async function clearConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  const messagesRef = collection(
    db,
    'users',
    userId,
    'conversations',
    conversationId,
    'messages'
  );

  const { getDocs, deleteDoc } = await import('firebase/firestore');
  const querySnapshot = await getDocs(messagesRef);

  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Update conversation
  const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    updatedAt: serverTimestamp(),
    lastMessage: null,
    lastMessageTime: null,
  });
}

// Period Cycle interfaces
export interface CycleData {
  id: string;
  userId: string;
  start_date: string; // YYYY-MM-DD format
  end_date: string; // YYYY-MM-DD format
  symptoms: string[];
  flow_intensity: 'light' | 'medium' | 'heavy';
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Save cycle data
export async function saveCycleData(
  userId: string,
  cycleData: Omit<CycleData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const cyclesRef = collection(db, 'users', userId, 'cycles');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(cyclesRef, {
    ...cycleData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get all cycles for a user
export async function getUserCycles(userId: string): Promise<CycleData[]> {
  const cyclesRef = collection(db, 'users', userId, 'cycles');
  const { getDocs, query, orderBy } = await import('firebase/firestore');
  
  const q = query(cyclesRef, orderBy('start_date', 'asc'));
  const querySnapshot = await getDocs(q);

  const cycles: CycleData[] = [];
  querySnapshot.forEach((doc) => {
    cycles.push({
      id: doc.id,
      ...doc.data(),
    } as CycleData);
  });

  return cycles;
}

// Update cycle data
export async function updateCycleData(
  userId: string,
  cycleId: string,
  updates: Partial<Omit<CycleData, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const cycleRef = doc(db, 'users', userId, 'cycles', cycleId);
  
  await updateDoc(cycleRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete cycle data
export async function deleteCycleData(
  userId: string,
  cycleId: string
): Promise<void> {
  const cycleRef = doc(db, 'users', userId, 'cycles', cycleId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(cycleRef);
}

// Get cycle by ID
export async function getCycleById(
  userId: string,
  cycleId: string
): Promise<CycleData | null> {
  const cycleRef = doc(db, 'users', userId, 'cycles', cycleId);
  const cycleSnap = await getDoc(cycleRef);

  if (cycleSnap.exists()) {
    return {
      id: cycleSnap.id,
      ...cycleSnap.data(),
    } as CycleData;
  }

  return null;
}

// Recovery Log interfaces
export interface RecoveryLog {
  id: string;
  userId: string;
  day: number; // Days post-delivery
  deliveryType: 'vaginal' | 'csection';
  sleep: number; // 1-9 hours
  pain: number; // 1-10 scale
  bleeding: number; // 0-5 scale
  energy: number; // 1-10 scale
  activity: number; // Steps count
  mood: number; // 1-10 scale
  fever: boolean;
  age: number; // User's age
  firstTimeMom: boolean; // Is this their first baby
  recoveryScore: number; // 0-100 calculated by ML model
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Save recovery log
export async function saveRecoveryLog(
  userId: string,
  logData: Omit<RecoveryLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const logsRef = collection(db, 'users', userId, 'recoveryLogs');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(logsRef, {
    ...logData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get all recovery logs for a user
export async function getRecoveryLogs(userId: string): Promise<RecoveryLog[]> {
  const logsRef = collection(db, 'users', userId, 'recoveryLogs');
  const { getDocs, query, orderBy } = await import('firebase/firestore');
  
  const q = query(logsRef, orderBy('day', 'asc'));
  const querySnapshot = await getDocs(q);

  const logs: RecoveryLog[] = [];
  querySnapshot.forEach((doc) => {
    logs.push({
      id: doc.id,
      ...doc.data(),
    } as RecoveryLog);
  });

  return logs;
}

// Get recovery log by day
export async function getRecoveryLogByDay(
  userId: string,
  day: number
): Promise<RecoveryLog | null> {
  const logsRef = collection(db, 'users', userId, 'recoveryLogs');
  const { getDocs, query, where, limit } = await import('firebase/firestore');
  
  const q = query(logsRef, where('day', '==', day), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as RecoveryLog;
  }

  return null;
}

// Update recovery log
export async function updateRecoveryLog(
  userId: string,
  logId: string,
  updates: Partial<Omit<RecoveryLog, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const logRef = doc(db, 'users', userId, 'recoveryLogs', logId);
  
  await updateDoc(logRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete recovery log
export async function deleteRecoveryLog(
  userId: string,
  logId: string
): Promise<void> {
  const logRef = doc(db, 'users', userId, 'recoveryLogs', logId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(logRef);
}

// Get latest recovery log
export async function getLatestRecoveryLog(userId: string): Promise<RecoveryLog | null> {
  const logsRef = collection(db, 'users', userId, 'recoveryLogs');
  const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(logsRef, orderBy('day', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as RecoveryLog;
  }

  return null;
}

// Save delivery information
export interface DeliveryInfo {
  userId: string;
  deliveryType: 'vaginal' | 'csection';
  deliveryDate: string; // YYYY-MM-DD format
  firstTimeMom?: boolean;
  complications?: string[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function saveDeliveryInfo(
  userId: string,
  deliveryData: Omit<DeliveryInfo, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const deliveryRef = doc(db, 'users', userId, 'postpartum', 'delivery');
  
  await setDoc(deliveryRef, {
    ...deliveryData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getDeliveryInfo(userId: string): Promise<DeliveryInfo | null> {
  const deliveryRef = doc(db, 'users', userId, 'postpartum', 'delivery');
  const deliverySnap = await getDoc(deliveryRef);

  if (deliverySnap.exists()) {
    return deliverySnap.data() as DeliveryInfo;
  }

  return null;
}
