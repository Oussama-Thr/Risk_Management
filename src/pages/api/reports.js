import { connectToDatabase } from '../../lib/db';
import Report from '../../models/Report';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      
      const { title, description, location, username } = req.body;

      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const report = new Report({
        title,
        description,
        location,
        username,
      });

      await report.save();

      res.status(201).json({ message: 'Report submitted', report });
    } catch (error) {
      console.error('Error saving report:', error);
      res.status(500).json({ message: 'Failed to save report' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
