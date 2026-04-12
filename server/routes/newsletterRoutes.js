import express from 'express';

// ESM default export interop
const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    // If Resend API keys aren't added yet, mock the success so frontend UI still works!
    if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
      console.log(`[Newsletter] Mock subscribed email: ${email} (Please set RESEND_API_KEY & RESEND_AUDIENCE_ID in .env)`);
      return res.status(200).json({ 
        success: true, 
        message: 'Mock subscription complete. Setup Resend environment variables to sync.' 
      });
    }

    // Native fetch request to Resend's Audience Contacts API (No SDK required!)
    const response = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${RESEND_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('[Resend Error]', errorData);
        throw new Error('Failed to push contact to Resend');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Internal server error while subscribing' });
  }
});

export default router;
