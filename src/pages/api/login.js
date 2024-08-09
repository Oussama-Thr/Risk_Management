// import { connectToDatabase } from '../../utils/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const db = await connectToDatabase();
//       const user = await db.collection('users').findOne({ email, password });

//       if (user) {
//         // Generate a token or session for the user
//         const token = generateToken(user);
//         res.status(200).json({ token });
//       } else {
//         res.status(401).json({ error: 'Invalid email or password' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while logging in' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

// Second Method
import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, userId: user._id });
}