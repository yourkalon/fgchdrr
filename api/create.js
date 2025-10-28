// Simple and clean version
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase config - directly in code for testing
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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { originalUrl, customSlug } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Generate slug
    const slug = customSlug || Math.random().toString(36).substring(2, 8);

    // Save to Firestore
    await setDoc(doc(db, 'urls', slug), {
      originalUrl: originalUrl,
      slug: slug,
      clicks: 0,
      createdAt: new Date().toISOString()
    });

    const shortUrl = `https://${process.env.VERCEL_URL || 'fgcbdrr.vercel.app'}/${slug}`;

    res.status(200).json({
      success: true,
      shortUrl: shortUrl,
      slug: slug,
      originalUrl: originalUrl
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
