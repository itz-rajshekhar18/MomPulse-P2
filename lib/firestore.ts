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
  role?: 'user' | 'admin' | 'doctor'; // User role for access control
  currentStage?: 'planning' | 'postpartum' | 'pregnancy' | 'period';
  age?: number;
  onboardingCompleted?: boolean;
  cycleSettings?: {
    avgCycleLength: number;
    avgPeriodLength: number;
    lastPeriodDate: string;
    predictOvulation: boolean;
    trackFlowIntensity: boolean;
    moodTracking: boolean;
    cycleStartWarning: boolean;
    dailyLogReminder: boolean;
    insightNotifications: boolean;
    reminderTime: string;
  };
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

  // Trigger ML prediction after saving cycle
  try {
    const allCycles = await getUserCycles(userId);
    await fetch('/api/ml/period-prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        cycles: allCycles
      })
    });
  } catch (error) {
    console.error('Error triggering ML prediction:', error);
    // Don't fail the cycle save if ML prediction fails
  }

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

// Period Predictions interface
export interface PeriodPrediction {
  userId: string;
  nextPeriodDate: string;
  nextOvulationDate: string;
  predictedCycleLength: number;
  predictedPeriodLength: number;
  confidence: number;
  fertileWindow: {
    start: string;
    end: string;
  };
  insights: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Save period prediction from ML backend
export async function savePeriodPrediction(
  userId: string,
  predictionData: Omit<PeriodPrediction, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const predictionRef = doc(db, 'users', userId, 'predictions', 'period');
  
  await setDoc(predictionRef, {
    ...predictionData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Get latest period prediction
export async function getPeriodPrediction(userId: string): Promise<PeriodPrediction | null> {
  const predictionRef = doc(db, 'users', userId, 'predictions', 'period');
  const predictionSnap = await getDoc(predictionRef);

  if (predictionSnap.exists()) {
    return predictionSnap.data() as PeriodPrediction;
  }

  return null;
}

// Community Post interfaces
export type CommunitySection = 'period' | 'pre-pregnancy' | 'postpartum' | 'general';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  section: CommunitySection;
  topics?: string[];
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommunityLike {
  userId: string;
  userName: string;
  createdAt: Timestamp;
}

export interface CommunityProfile {
  userId: string;
  userName: string;
  userAvatar?: string;
  bio?: string;
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  reputation: number;
  badges: string[];
  joinedAt: Timestamp;
  updatedAt: Timestamp;
}

// Create a community post
export async function createCommunityPost(
  section: CommunitySection,
  postData: Omit<CommunityPost, 'id' | 'likesCount' | 'commentsCount' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  console.log('createCommunityPost - Creating post in section:', section);
  console.log('createCommunityPost - Post data section:', postData.section);
  console.log('createCommunityPost - Collection path:', `community/${section}/posts`);
  
  // Validate that postData.section matches the section parameter
  if (postData.section !== section) {
    throw new Error(`Section mismatch: postData.section (${postData.section}) !== section parameter (${section})`);
  }
  
  const postsRef = collection(db, 'community', section, 'posts');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(postsRef, {
    ...postData,
    section, // Ensure section is set correctly
    likesCount: 0,
    commentsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log('createCommunityPost - Post created with ID:', docRef.id);

  // Update user's community profile
  await incrementUserPostCount(postData.userId);

  return docRef.id;
}

// Get posts from a specific section
export async function getCommunityPosts(
  section: CommunitySection,
  limitCount: number = 20
): Promise<CommunityPost[]> {
  console.log('getCommunityPosts - Querying section:', section);
  console.log('getCommunityPosts - Collection path:', `community/${section}/posts`);
  
  const postsRef = collection(db, 'community', section, 'posts');
  const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);

  const posts: CommunityPost[] = [];
  querySnapshot.forEach((doc) => {
    const postData = doc.data() as CommunityPost;
    console.log('getCommunityPosts - Found post:', {
      id: doc.id,
      section: postData.section,
      content: postData.content.substring(0, 50)
    });
    posts.push({
      ...postData,
      id: doc.id,
    });
  });

  console.log('getCommunityPosts - Total posts found:', posts.length);
  return posts;
}

// Get a single post by ID
export async function getCommunityPost(
  section: CommunitySection,
  postId: string
): Promise<CommunityPost | null> {
  const postRef = doc(db, 'community', section, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    return {
      id: postSnap.id,
      ...postSnap.data(),
    } as CommunityPost;
  }

  return null;
}

// Update a community post
export async function updateCommunityPost(
  section: CommunitySection,
  postId: string,
  updates: Partial<Pick<CommunityPost, 'content' | 'topics' | 'imageUrl'>>
): Promise<void> {
  const postRef = doc(db, 'community', section, 'posts', postId);
  
  await updateDoc(postRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete a community post
export async function deleteCommunityPost(
  section: CommunitySection,
  postId: string,
  userId: string
): Promise<void> {
  const postRef = doc(db, 'community', section, 'posts', postId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(postRef);

  // Update user's community profile
  await decrementUserPostCount(userId);
}

// Add a comment to a post
export async function addComment(
  section: CommunitySection,
  postId: string,
  commentData: Omit<CommunityComment, 'id' | 'postId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const commentsRef = collection(db, 'community', section, 'posts', postId, 'comments');
  const { addDoc, increment } = await import('firebase/firestore');
  
  const docRef = await addDoc(commentsRef, {
    ...commentData,
    postId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Increment comments count on the post
  const postRef = doc(db, 'community', section, 'posts', postId);
  await updateDoc(postRef, {
    commentsCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  // Update user's community profile
  await incrementUserCommentCount(commentData.userId);

  return docRef.id;
}

// Get comments for a post
export async function getPostComments(
  section: CommunitySection,
  postId: string
): Promise<CommunityComment[]> {
  const commentsRef = collection(db, 'community', section, 'posts', postId, 'comments');
  const { getDocs, query, orderBy } = await import('firebase/firestore');
  
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);

  const comments: CommunityComment[] = [];
  querySnapshot.forEach((doc) => {
    comments.push({
      id: doc.id,
      ...doc.data(),
    } as CommunityComment);
  });

  return comments;
}

// Delete a comment
export async function deleteComment(
  section: CommunitySection,
  postId: string,
  commentId: string,
  userId: string
): Promise<void> {
  const commentRef = doc(db, 'community', section, 'posts', postId, 'comments', commentId);
  const { deleteDoc, increment } = await import('firebase/firestore');
  
  await deleteDoc(commentRef);

  // Decrement comments count on the post
  const postRef = doc(db, 'community', section, 'posts', postId);
  await updateDoc(postRef, {
    commentsCount: increment(-1),
    updatedAt: serverTimestamp(),
  });

  // Update user's community profile
  await decrementUserCommentCount(userId);
}

// Like a post
export async function likePost(
  section: CommunitySection,
  postId: string,
  userId: string,
  userName: string
): Promise<void> {
  const likeRef = doc(db, 'community', section, 'posts', postId, 'likes', userId);
  const { increment } = await import('firebase/firestore');
  
  await setDoc(likeRef, {
    userId,
    userName,
    createdAt: serverTimestamp(),
  });

  // Increment likes count on the post
  const postRef = doc(db, 'community', section, 'posts', postId);
  await updateDoc(postRef, {
    likesCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

// Unlike a post
export async function unlikePost(
  section: CommunitySection,
  postId: string,
  userId: string
): Promise<void> {
  const likeRef = doc(db, 'community', section, 'posts', postId, 'likes', userId);
  const { deleteDoc, increment } = await import('firebase/firestore');
  
  await deleteDoc(likeRef);

  // Decrement likes count on the post
  const postRef = doc(db, 'community', section, 'posts', postId);
  await updateDoc(postRef, {
    likesCount: increment(-1),
    updatedAt: serverTimestamp(),
  });
}

// Check if user has liked a post
export async function hasUserLikedPost(
  section: CommunitySection,
  postId: string,
  userId: string
): Promise<boolean> {
  const likeRef = doc(db, 'community', section, 'posts', postId, 'likes', userId);
  const likeSnap = await getDoc(likeRef);
  
  return likeSnap.exists();
}

// Get post likes
export async function getPostLikes(
  section: CommunitySection,
  postId: string
): Promise<CommunityLike[]> {
  const likesRef = collection(db, 'community', section, 'posts', postId, 'likes');
  const { getDocs } = await import('firebase/firestore');
  
  const querySnapshot = await getDocs(likesRef);

  const likes: CommunityLike[] = [];
  querySnapshot.forEach((doc) => {
    likes.push(doc.data() as CommunityLike);
  });

  return likes;
}

// Get or create user's community profile
export async function getCommunityProfile(userId: string): Promise<CommunityProfile | null> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    return profileSnap.data() as CommunityProfile;
  }

  return null;
}

// Create or update community profile
export async function createOrUpdateCommunityProfile(
  userId: string,
  profileData: Partial<Omit<CommunityProfile, 'userId' | 'joinedAt' | 'updatedAt'>>
): Promise<void> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    // Update existing profile
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new profile
    await setDoc(profileRef, {
      userId,
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0,
      reputation: 0,
      badges: [],
      ...profileData,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// Helper functions to update community profile stats
async function incrementUserPostCount(userId: string): Promise<void> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(profileRef, {
    postsCount: increment(1),
    reputation: increment(5), // Award 5 reputation points for a post
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // If profile doesn't exist, create it
    await createOrUpdateCommunityProfile(userId, {
      postsCount: 1,
      reputation: 5,
    });
  });
}

async function decrementUserPostCount(userId: string): Promise<void> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(profileRef, {
    postsCount: increment(-1),
    reputation: increment(-5),
    updatedAt: serverTimestamp(),
  }).catch(() => {
    // Ignore if profile doesn't exist
  });
}

async function incrementUserCommentCount(userId: string): Promise<void> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(profileRef, {
    commentsCount: increment(1),
    reputation: increment(2), // Award 2 reputation points for a comment
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // If profile doesn't exist, create it
    await createOrUpdateCommunityProfile(userId, {
      commentsCount: 1,
      reputation: 2,
    });
  });
}

async function decrementUserCommentCount(userId: string): Promise<void> {
  const profileRef = doc(db, 'communityProfiles', userId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(profileRef, {
    commentsCount: increment(-1),
    reputation: increment(-2),
    updatedAt: serverTimestamp(),
  }).catch(() => {
    // Ignore if profile doesn't exist
  });
}

// Get posts by user
export async function getUserPosts(
  userId: string,
  section?: CommunitySection
): Promise<CommunityPost[]> {
  const { getDocs, query, where, orderBy, collectionGroup } = await import('firebase/firestore');
  
  if (section) {
    // Get posts from specific section
    const postsRef = collection(db, 'community', section, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts: CommunityPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as CommunityPost);
    });

    return posts;
  } else {
    // Get posts from all sections using collection group query
    const postsQuery = query(
      collectionGroup(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(postsQuery);

    const posts: CommunityPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as CommunityPost);
    });

    return posts;
  }
}

// Get top contributors for a section
export async function getTopContributors(
  limitCount: number = 5
): Promise<CommunityProfile[]> {
  const profilesRef = collection(db, 'communityProfiles');
  const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(profilesRef, orderBy('reputation', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);

  const profiles: CommunityProfile[] = [];
  querySnapshot.forEach((doc) => {
    profiles.push(doc.data() as CommunityProfile);
  });

  return profiles;
}

// Content Management interfaces
export type ContentSection = 'period' | 'pre-pregnancy' | 'pregnancy' | 'postpartum' | 'general';
export type ContentCategory = 'nutrition' | 'mental-health' | 'sleep' | 'movement' | 'recovery' | 'health' | 'mindfulness';

export interface Article {
  id: string;
  title: string;
  category: ContentCategory;
  section: ContentSection;
  content: string;
  excerpt?: string;
  readTime?: number;
  author?: string;
  tags?: string[];
  featuredImage?: string;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Video {
  id: string;
  title: string;
  category: ContentCategory;
  section: ContentSection;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  instructor?: string;
  tags?: string[];
  status: 'published' | 'draft';
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create an article
export async function createArticle(
  articleData: Omit<Article, 'id' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const articlesRef = collection(db, 'content', 'articles', 'items');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(articlesRef, {
    ...articleData,
    views: 0,
    likes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Create a video
export async function createVideo(
  videoData: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const videosRef = collection(db, 'content', 'videos', 'items');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(videosRef, {
    ...videoData,
    views: 0,
    likes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get articles by section
export async function getArticlesBySection(
  section: ContentSection,
  limitCount: number = 20
): Promise<Article[]> {
  const articlesRef = collection(db, 'content', 'articles', 'items');
  const { getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(
    articlesRef,
    where('section', '==', section),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);

  const articles: Article[] = [];
  querySnapshot.forEach((doc) => {
    articles.push({
      id: doc.id,
      ...doc.data(),
    } as Article);
  });

  return articles;
}

// Get videos by section
export async function getVideosBySection(
  section: ContentSection,
  limitCount: number = 20
): Promise<Video[]> {
  const videosRef = collection(db, 'content', 'videos', 'items');
  const { getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(
    videosRef,
    where('section', '==', section),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);

  const videos: Video[] = [];
  querySnapshot.forEach((doc) => {
    videos.push({
      id: doc.id,
      ...doc.data(),
    } as Video);
  });

  return videos;
}

// Get all articles (for admin)
export async function getAllArticles(): Promise<Article[]> {
  const articlesRef = collection(db, 'content', 'articles', 'items');
  const { getDocs, query, orderBy } = await import('firebase/firestore');
  
  const q = query(articlesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const articles: Article[] = [];
  querySnapshot.forEach((doc) => {
    articles.push({
      id: doc.id,
      ...doc.data(),
    } as Article);
  });

  return articles;
}

// Get all videos (for admin)
export async function getAllVideos(): Promise<Video[]> {
  const videosRef = collection(db, 'content', 'videos', 'items');
  const { getDocs, query, orderBy } = await import('firebase/firestore');
  
  const q = query(videosRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const videos: Video[] = [];
  querySnapshot.forEach((doc) => {
    videos.push({
      id: doc.id,
      ...doc.data(),
    } as Video);
  });

  return videos;
}

// Update article
export async function updateArticle(
  articleId: string,
  updates: Partial<Omit<Article, 'id' | 'createdAt'>>
): Promise<void> {
  const articleRef = doc(db, 'content', 'articles', 'items', articleId);
  
  await updateDoc(articleRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Update video
export async function updateVideo(
  videoId: string,
  updates: Partial<Omit<Video, 'id' | 'createdAt'>>
): Promise<void> {
  const videoRef = doc(db, 'content', 'videos', 'items', videoId);
  
  await updateDoc(videoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete article
export async function deleteArticle(articleId: string): Promise<void> {
  const articleRef = doc(db, 'content', 'articles', 'items', articleId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(articleRef);
}

// Delete video
export async function deleteVideo(videoId: string): Promise<void> {
  const videoRef = doc(db, 'content', 'videos', 'items', videoId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(videoRef);
}

// Increment article views
export async function incrementArticleViews(articleId: string): Promise<void> {
  const articleRef = doc(db, 'content', 'articles', 'items', articleId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(articleRef, {
    views: increment(1),
  });
}

// Increment video views
export async function incrementVideoViews(videoId: string): Promise<void> {
  const videoRef = doc(db, 'content', 'videos', 'items', videoId);
  const { increment } = await import('firebase/firestore');
  
  await updateDoc(videoRef, {
    views: increment(1),
  });
}

// Doctors and Consultations interfaces
export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  photoURL?: string;
  email?: string;
  phone?: string;
  availability?: string[];
  status: 'active' | 'away';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: number;
  attendees: number;
  maxAttendees?: number;
  instructor?: string;
  category: string;
  color: 'pink' | 'green' | 'purple' | 'blue' | 'teal';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Get all doctors
export async function getAllDoctors(): Promise<Doctor[]> {
  const doctorsRef = collection(db, 'doctors');
  const { getDocs, query, where, orderBy } = await import('firebase/firestore');
  
  const q = query(doctorsRef, where('status', '==', 'active'), orderBy('rating', 'desc'));
  const querySnapshot = await getDocs(q);

  const doctors: Doctor[] = [];
  querySnapshot.forEach((doc) => {
    doctors.push({
      id: doc.id,
      ...doc.data(),
    } as Doctor);
  });

  return doctors;
}

// Get upcoming sessions
export async function getUpcomingSessions(limitCount: number = 10): Promise<Session[]> {
  const sessionsRef = collection(db, 'sessions');
  const { getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
  
  const q = query(
    sessionsRef,
    where('status', '==', 'upcoming'),
    orderBy('date', 'asc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);

  const sessions: Session[] = [];
  querySnapshot.forEach((doc) => {
    sessions.push({
      id: doc.id,
      ...doc.data(),
    } as Session);
  });

  return sessions;
}

// Create doctor (admin only)
export async function createDoctor(
  doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const doctorsRef = collection(db, 'doctors');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(doctorsRef, {
    ...doctorData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Create session (admin only)
export async function createSession(
  sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const sessionsRef = collection(db, 'sessions');
  const { addDoc } = await import('firebase/firestore');
  
  const docRef = await addDoc(sessionsRef, {
    ...sessionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update doctor
export async function updateDoctor(
  doctorId: string,
  updates: Partial<Omit<Doctor, 'id' | 'createdAt'>>
): Promise<void> {
  const doctorRef = doc(db, 'doctors', doctorId);
  
  await updateDoc(doctorRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete doctor
export async function deleteDoctor(doctorId: string): Promise<void> {
  const doctorRef = doc(db, 'doctors', doctorId);
  const { deleteDoc } = await import('firebase/firestore');
  
  await deleteDoc(doctorRef);
}
