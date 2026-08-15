import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@sanity/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, artworkSlug, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required inquiry fields (name, email, message)' });
    }

    const sanityProjectId = process.env.VITE_SANITY_PROJECT_ID;
    const sanityDataset = process.env.VITE_SANITY_DATASET || 'production';
    const sanityWriteToken = process.env.SANITY_WRITE_TOKEN;

    const doc = {
      _type: 'inquiry',
      name,
      email,
      subject: subject || 'General Studio Inquiry',
      artworkSlug: artworkSlug || '',
      message,
      createdAt: new Date().toISOString(),
    };

    // Forward to FormSubmit for email notifications
    try {
      await fetch('https://formsubmit.co/ajax/rosmainarose@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: name,
          Email: email,
          _subject: subject || 'New Inquiry from THEROSEPALLETTE',
          Artwork: artworkSlug || 'General Inquiry',
          Message: message,
        }),
      });
    } catch (emailError) {
      console.error('Failed to forward email inquiry:', emailError);
    }

    let createdId = 'mock-id';
    if (sanityProjectId && sanityWriteToken) {
      const client = createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: '2024-03-01',
        token: sanityWriteToken,
        useCdn: false,
      });
      const created = await client.create(doc);
      createdId = created._id;
    }

    return res.status(200).json({ message: 'Inquiry processed successfully', id: createdId });
  } catch (error: any) {
    console.error('Inquiry API error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
