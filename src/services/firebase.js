import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDI3wf2KzzaD10K_UrU-KVqi5q7oYkImyc",
  authDomain: "fir-chat-app-df231.firebaseapp.com",
  databaseURL: "https://fir-chat-app-df231-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-chat-app-df231",
  storageBucket: "fir-chat-app-df231.appspot.com",
  messagingSenderId: "765364852648",
  appId: "1:765364852648:web:b91d00bf8ec4960cccaf9d",
  measurementId: "G-Q5SSZXM0JE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loginWithGoogle() {
  try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      const { user } = await signInWithPopup(auth, provider);

      return { uid: user.uid, displayName: user.displayName };
  } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request') {
          console.error(error);
      }

      return null;
  }
}

async function sendMessage(roomId, user, text) {
  try {
      await addDoc(collection(db, 'fir-chat-app-df231', roomId, 'messages'), {
          uid: user.uid,
          displayName: user.displayName,
          text: text.trim(),
          timestamp: serverTimestamp(),
      });
  } catch (error) {
      console.error(error);
  }
}

function getMessages(roomId, callback) {
  return onSnapshot(
      query(
          collection(db, 'fir-chat-app-df231', roomId, 'messages'),
          orderBy('timestamp', 'asc')
      ),
      (querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          callback(messages);
      }
  );
}


export { loginWithGoogle, sendMessage, getMessages };