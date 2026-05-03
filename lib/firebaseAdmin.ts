// Firebase Admin SDK - Server-side only
// This file should only be imported in API routes (server-side)

let adminDb: any;
let adminAuth: any;
let initialized = false;

async function initializeFirebaseAdmin() {
  if (initialized) {
    return { adminDb, adminAuth };
  }

  try {
    const admin = await import('firebase-admin');
    const { getFirestore } = await import('firebase-admin/firestore');
    const { getAuth } = await import('firebase-admin/auth');

    let app: any;

    // Initialize Firebase Admin
    if (!admin.apps || admin.apps.length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Production: Use service account key from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
      ) {
        // Alternative: Use individual environment variables
        app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } else {
        // Development: Initialize without credentials
        console.warn('Firebase Admin: No service account credentials found. Using default credentials.');
        app = admin.initializeApp();
      }
    } else {
      app = admin.apps[0];
    }

    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
    initialized = true;

    return { adminDb, adminAuth };
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Helper function to save period prediction (server-side)
export async function savePeriodPredictionAdmin(userId: string, prediction: any) {
  try {
    const { adminDb } = await initializeFirebaseAdmin();
    
    const predictionRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('predictions')
      .doc('latest');

    await predictionRef.set({
      ...prediction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving prediction (admin):', error);
    throw error;
  }
}

// Export initialization function for other uses
export { initializeFirebaseAdmin };
