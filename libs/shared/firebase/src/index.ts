import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { doc, getFirestore, Firestore, setDoc } from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  getMessaging,
  getToken,
  isSupported as isMessagingSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'placeholder-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'placeholder.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'placeholder-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'placeholder.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:000000000000:web:placeholder',
};

// Avoid re-initializing in HMR environments
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);

export const db: Firestore = getFirestore(app);

export const signIn = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
};

export const signOut = (): Promise<void> => firebaseSignOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  firebaseOnAuthStateChanged(auth, callback);

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!(await isMessagingSupported())) {
    return null;
  }

  return getMessaging(app);
}

export async function getFirebaseMessagingToken(
  serviceWorkerRegistration: ServiceWorkerRegistration
): Promise<string | null> {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return null;
  }

  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  });
}

export async function onFirebaseForegroundMessage(
  callback: (payload: MessagePayload) => void
): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return () => undefined;
  }

  return onMessage(messaging, callback);
}

export async function saveFirebaseMessagingToken(
  userId: string,
  token: string
): Promise<void> {
  await setDoc(
    doc(db, 'notification_subscriptions', `${userId}_web`),
    {
      userId,
      token,
      platform: 'web',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
