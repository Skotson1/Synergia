import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Validate connection on boot as required by Firestore integration standards
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[EduSynergia Cloud] Połączono pomyślnie z bazą danych Google Cloud Firestore.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[EduSynergia Cloud] Firestore offline check error:', error.message);
      return false;
    }
    // Any permission or missing doc error still confirms server communication
    return true;
  }
}

// Initial test trigger
testFirestoreConnection();

export { doc, getDoc, getDocFromServer, setDoc, onSnapshot };
