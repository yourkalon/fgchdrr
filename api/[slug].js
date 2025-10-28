import { db } from '../../lib/firebase.js';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export default async function handler(req, res) {
  const { slug } = req.query;

  // Handle root URL
  if (!slug || slug === 'index.html') {
    return res.redirect(302, '/');
  }

  try {
    const docRef = doc(db, 'urls', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const urlData = docSnap.data();
      
      // Update click count
      await updateDoc(docRef, {
        clicks: increment(1),
        lastAccessed: new Date().toISOString()
      });

      // Redirect to original URL
      res.redirect(302, urlData.originalUrl);
    } else {
      // URL not found
      res.status(404).json({ 
        success: false,
        error: 'Short URL not found'
      });
    }
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
}