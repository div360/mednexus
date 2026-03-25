import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@mednexus/shared/firebase';
import type { AppUser } from '@mednexus/shared/types';

const USERS_COLLECTION = 'users';

/**
 * Stores non-secret profile fields in Firestore (`users/{uid}`).
 * Passwords and auth tokens live only in Firebase Authentication — never here.
 */
export async function upsertUserProfileInFirestore(user: AppUser): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
