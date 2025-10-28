import { db } from '../../lib/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Simple slug generator
function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { originalUrl, customSlug } = req.body;

    // Validation
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // URL validation
    let validUrl;
    try {
      validUrl = new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL. Please include http:// or https://'
      });
    }

    let slug = customSlug || generateSlug();
    
    // Custom slug validation
    if (customSlug) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
        return res.status(400).json({
          success: false,
          error: 'Slug can only contain letters, numbers, hyphens, and underscores'
        });
      }
      
      // Check if slug exists
      try {
        const existingDoc = await getDoc(doc(db, 'urls', customSlug));
        if (existingDoc.exists()) {
          return res.status(400).json({
            success: false,
            error: 'This short name is already taken'
          });
        }
      } catch (dbError) {
        console.error('Database check error:', dbError);
        return res.status(500).json({
          success: false,
          error: 'Database connection failed'
        });
      }
    }

    // Save to Firestore
    try {
      await setDoc(doc(db, 'urls', slug), {
        originalUrl: originalUrl,
        slug: slug,
        clicks: 0,
        createdAt: new Date().toISOString(),
        createdBy: 'web-user'
      });
    } catch (saveError) {
      console.error('Save error:', saveError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save URL to database'
      });
    }

    // Success response
    const baseUrl = process.env.VERCEL_URL ? 
      `https://${process.env.VERCEL_URL}` : 
      'http://localhost:3000';

    res.status(200).json({
      success: true,
      shortUrl: `${baseUrl}/${slug}`,
      slug: slug,
      originalUrl: originalUrl,
      message: 'URL shortened successfully!'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}