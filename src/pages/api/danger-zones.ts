import { connectToDatabase } from '../../lib/db';
import Danger from '../../models/Danger';

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    const dangers = await Danger.find({});
    if (!dangers || dangers.length === 0) {
      return res.status(200).json({ message: 'No data found' });
    }
    return res.status(200).json(dangers);
  } catch (error) {
    return res.status(500).json({ error: 'Database query failed' });
  }
}
