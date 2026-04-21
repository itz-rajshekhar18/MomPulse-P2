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
