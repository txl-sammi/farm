import { db } from '@/app/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GeoPoint } from "firebase/firestore";

const COLLECTIONS = {
  USERS: 'users',
  FARMS: 'farms',
  // Add other collections as needed
};

/**
 * Load user tokens from Firestore
 */
export async function loadUsersFromFirestore(userId: string) {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const docSnapshot = await getDoc(userRef);
  return docSnapshot.exists() ? docSnapshot.data() : null;
}

/**
 * Save user farm to Firestore
 */
export async function saveUserToFirestore(userId: string, email: string, first_name: string, last_name: string) {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userRef, { email, first_name, last_name }, { merge: true });
}

export async function saveFarmToFirestore(
  userId: string,
  location: { latitude: number; longitude: number },
  plants: string[]
) {

  const farmRef = doc(db, COLLECTIONS.FARMS, userId);
  await setDoc(farmRef, {
    location: new GeoPoint(location.latitude, location.longitude),
    plants: plants,
  }, { merge: true });
}