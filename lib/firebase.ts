// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
    analytics = analyticsInstance;
  });
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Verification data storage functions
export interface VerificationData {
  id: string;
  userId: string;
  title: string;
  content: string;
  verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated";
  score: number;
  timestamp: Date;
  // AI Analysis data
  aiAnalysis?: {
    analysis: string;
    model: string;
    timestamp: string;
    newsData?: Array<{
      title: string;
      source: string;
      url: string;
      publishedAt: string;
      description: string;
      api: string;
    }>;
    structuredData?: {
      confidence: number;
      sources: string[];
      explanation: string;
      redFlags: string[];
      recommendations: string[];
      currentContext: string[];
      realTimeSources: string[];
      aiDetection?: string[];
    };
  };
  // Analysis data
  analysis?: {
    credibilityScore: number;
    sources: string[];
    reasoning: string[];
    evidenceMap?: {
      sources: Array<{
        name: string;
        trustRating: number;
        connections: string[];
      }>;
    };
    biasAnalysis?: {
      rating: "low" | "moderate" | "high";
      explanation: string;
    };
    timeline?: Array<{
      date: string;
      event: string;
      source: string;
    }>;
    deepfakeDetection?: {
      suspicious: boolean;
      timestamps: number[];
    };
    socialHeatmap?: {
      trending: boolean;
      platforms: string[];
      regions: string[];
    };
    multilingualSources?: string[];
    historicalCredibility?: {
      pastAccuracy: number;
      totalChecks: number;
    };
  };
  // Additional metadata
  urlsAnalyzed?: string[];
  detectedContent?: {
    links: string[];
    videoLinks: string[];
    images: string[];
    documents: string[];
  };
}

// Helper function to remove undefined values from objects
function removeUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeUndefinedValues(value);
      if (cleanedValue !== null && cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  
  return obj;
}

// Save verification data to Firestore
export const saveVerificationData = async (verificationData: VerificationData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Clean the data by removing undefined values
    const cleanedData = removeUndefinedValues(verificationData);

    const verificationWithUser = {
      ...cleanedData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'verifications'), verificationWithUser);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving verification data:', error);
    return { success: false, error: error.message };
  }
};

// Get verification history for current user
export const getVerificationHistory = async (limitCount: number = 50) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'verifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const verifications: VerificationData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Raw verification data:', data);
      verifications.push({
        id: doc.id,
        ...data,
        timestamp: data.createdAt?.toDate() || new Date(),
      } as VerificationData);
    });

    return { success: true, data: verifications };
  } catch (error: any) {
    console.error('Error getting verification history:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Delete verification data
export const deleteVerificationData = async (verificationId: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Attempting to delete verification:', verificationId);
    console.log('Current user:', user.uid);

    // Try to delete the document directly
    // The security rules will handle the permission check
    await deleteDoc(doc(db, 'verifications', verificationId));
    
    console.log('Successfully deleted verification:', verificationId);
    return { success: true };
  } catch (error: any) {
    const user = getCurrentUser();
    console.error('Error deleting verification data:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      verificationId,
      userId: user?.uid || 'unknown'
    });
    return { success: false, error: error.message };
  }
};

// Update verification data
export const updateVerificationData = async (verificationId: string, updates: Partial<VerificationData>) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, verify the user owns this document by querying it
    const q = query(
      collection(db, 'verifications'),
      where('userId', '==', user.uid),
      where('__name__', '==', verificationId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: false, error: 'Verification not found or access denied' };
    }

    // Now update the document
    await updateDoc(doc(db, 'verifications', verificationId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating verification data:', error);
    return { success: false, error: error.message };
  }
};

// Get verification by ID
export const getVerificationById = async (verificationId: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'verifications'),
      where('userId', '==', user.uid),
      where('__name__', '==', verificationId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: false, error: 'Verification not found' };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    const verification: VerificationData = {
      id: doc.id,
      ...data,
      timestamp: data.createdAt?.toDate() || new Date(),
    } as VerificationData;

    return { success: true, data: verification };
  } catch (error: any) {
    console.error('Error getting verification by ID:', error);
    return { success: false, error: error.message };
  }
};

// Token Management Functions
export interface TokenUsage {
  userId: string
  used: number
  total: number
  resetDate: Date
  plan: "free" | "pro" | "enterprise"
  lastUpdated: Date
}

export const getUserTokenUsage = async () => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const q = query(
      collection(db, 'tokenUsage'),
      where('userId', '==', user.uid),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      // Create default token usage for new user
      const defaultUsage: TokenUsage = {
        userId: user.uid,
        used: 0,
        total: 50, // Free tier
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        plan: "free",
        lastUpdated: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'tokenUsage'), defaultUsage)
      return { success: true, data: { id: docRef.id, ...defaultUsage } }
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()
    
    // Convert Firestore Timestamps to JavaScript Date objects
    const tokenUsage: TokenUsage = {
      ...data,
      resetDate: data.resetDate?.toDate ? data.resetDate.toDate() : new Date(data.resetDate),
      lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
    } as TokenUsage
    
    // Check if reset date has passed
    if (tokenUsage.resetDate < new Date()) {
      // Reset tokens for new month
      const updatedUsage = {
        ...tokenUsage,
        used: 0,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date()
      }
      
      await updateDoc(doc.ref, updatedUsage)
      return { success: true, data: { id: doc.id, ...updatedUsage } }
    }

    return { success: true, data: { id: doc.id, ...tokenUsage } }
  } catch (error: any) {
    console.error('Error getting user token usage:', error)
    return { success: false, error: error.message }
  }
}

export const consumeTokens = async (amount: number = 1) => {
  try {
    console.log('Consuming tokens:', amount)
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const usageResult = await getUserTokenUsage()
    if (!usageResult.success) {
      throw new Error(usageResult.error)
    }

    const usage = usageResult.data as TokenUsage & { id: string }
    console.log('Current token usage:', usage.used, '/', usage.total)
    
    if (usage.used + amount > usage.total) {
      throw new Error('Insufficient tokens')
    }

    const updatedUsage = {
      ...usage,
      used: usage.used + amount,
      lastUpdated: new Date()
    }

    console.log('Updating token usage to:', updatedUsage.used, '/', updatedUsage.total)
    await updateDoc(doc(db, 'tokenUsage', usage.id), updatedUsage)
    console.log('Token consumption successful')
    return { success: true, data: updatedUsage }
  } catch (error: any) {
    console.error('Error consuming tokens:', error)
    return { success: false, error: error.message }
  }
}

export const upgradeUserPlan = async (plan: "free" | "pro" | "enterprise") => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const usageResult = await getUserTokenUsage()
    if (!usageResult.success) {
      throw new Error(usageResult.error)
    }

    const usage = usageResult.data as TokenUsage & { id: string }
    const newTotal = plan === "free" ? 50 : plan === "pro" ? 500 : 5000

    const updatedUsage = {
      ...usage,
      plan,
      total: newTotal,
      lastUpdated: new Date()
    }

    await updateDoc(doc(db, 'tokenUsage', usage.id), updatedUsage)
    return { success: true, data: updatedUsage }
  } catch (error: any) {
    console.error('Error upgrading user plan:', error)
    return { success: false, error: error.message }
  }
}

export const downgradeUserPlan = async (targetPlan: "free" | "pro" = "free") => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const usageResult = await getUserTokenUsage()
    if (!usageResult.success) {
      throw new Error(usageResult.error)
    }

    const usage = usageResult.data as TokenUsage & { id: string }
    
    // Only allow downgrade if user is currently on a higher plan
    if (usage.plan === 'free') {
      throw new Error('User is already on free plan')
    }
    
    if (usage.plan === 'pro' && targetPlan === 'pro') {
      throw new Error('User is already on pro plan')
    }

    const newTotal = targetPlan === "pro" ? 500 : 50

    const updatedUsage = {
      ...usage,
      plan: targetPlan,
      total: newTotal,
      lastUpdated: new Date()
    }

    await updateDoc(doc(db, 'tokenUsage', usage.id), updatedUsage)
    return { success: true, data: updatedUsage }
  } catch (error: any) {
    console.error('Error downgrading user plan:', error)
    return { success: false, error: error.message }
  }
}

export const getUserStripeSubscription = async () => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get the user's ID token for server-side verification
    const idToken = await user.getIdToken()
    
    const response = await fetch('/api/get-subscription', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch subscription')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error('Error getting user subscription:', error)
    return { success: false, error: error.message }
  }
}

export const changeSubscription = async (targetPlan: "free" | "pro" | "enterprise", paymentFrequency: "monthly" | "yearly" = "monthly") => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get the user's ID token for server-side verification
    const idToken = await user.getIdToken()
    
    const response = await fetch('/api/change-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        targetPlan,
        paymentFrequency,
        userId: user.uid,
        userEmail: user.email,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to change subscription')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error('Error changing subscription:', error)
    return { success: false, error: error.message }
  }
}

// Function to manually update user plan (for admin/debugging purposes)
export const updateUserPlanManually = async (userId: string, plan: "free" | "pro" | "enterprise") => {
  try {
    const newTotal = plan === "free" ? 50 : plan === "pro" ? 500 : 5000

    // Query the user's token usage document
    const q = query(
      collection(db, 'tokenUsage'),
      where('userId', '==', userId),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      // Create new token usage document if it doesn't exist
      const defaultUsage: TokenUsage = {
        userId: userId,
        used: 0,
        total: newTotal,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        plan: plan,
        lastUpdated: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'tokenUsage'), defaultUsage)
      return { success: true, data: { id: docRef.id, ...defaultUsage } }
    }

    const doc = querySnapshot.docs[0]
    const updatedUsage = {
      plan,
      total: newTotal,
      lastUpdated: new Date()
    }

    await updateDoc(doc.ref, updatedUsage)
    return { success: true, data: { id: doc.id, ...doc.data(), ...updatedUsage } }
  } catch (error: any) {
    console.error('Error manually updating user plan:', error)
    return { success: false, error: error.message }
  }
}

export { auth, app, analytics, db };
