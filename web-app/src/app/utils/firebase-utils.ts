import { db } from '@/app/firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { GeoPoint } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

export async function loadFarmFromFirestore(userId: string, farmId: string) {
  const userRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.FARMS, farmId);
  const docSnapshot = await getDoc(userRef);
  return docSnapshot.exists() ? docSnapshot.data() : null;
}

export async function getAllFarms(userId: string) {
  const farmsCollectionRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.FARMS);
  const farmsSnapshot = await getDocs(farmsCollectionRef);

  const farms = farmsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return farms; // 🔥 array of all farms [{ id, location, plants }, {...}, ...]
}

export async function saveFarmToFirestore(
  userId: string,
  name: string,
  location: { latitude: number; longitude: number },
  plants: string[]
) {
  const farmId = uuidv4();
  const farmRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.FARMS, farmId);
  console.log("Saving farm to Firestore:", {
    userId,
    name,
    location,
    plants,
  });
  await setDoc(farmRef, {
    name: name,
    location: new GeoPoint(location.latitude, location.longitude),
    plants: plants,
  }, { merge: true });
  return farmId;
}