
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyZImg-Uh79qppoJjyr3WIkCqPaE4MFFc",
  authDomain: "turty-2f096.firebaseapp.com",
  projectId: "turty-2f096",
  storageBucket: "turty-2f096.firebasestorage.app",
  messagingSenderId: "292943379883",
  appId: "1:292943379883:web:c9ac1161226993b90b66ee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.redirect(302, '/');
  }

  try {
    const docRef = doc(db, 'urls', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const urlData = docSnap.data();
      
      await updateDoc(docRef, {
        clicks: increment(1),
        lastAccessed: new Date().toISOString()
      });

      res.redirect(302, urlData.originalUrl);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
