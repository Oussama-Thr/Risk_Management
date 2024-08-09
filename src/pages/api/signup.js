// import { connectToDatabase } from '../../utils/db';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, email, password } = req.body;

//     try {
//       const db = await connectToDatabase();
//       const existingUser = await db.collection('users').findOne({ email });

//       if (existingUser) {
//         res.status(400).json({ error: 'User already exists' });
//         return;
//       }

//       const newUser = { name, email, password };
//       await db.collection('users').insertOne(newUser);

//       // Generate a token or session for the user
//       const token = generateToken(newUser);
//       res.status(200).json({ token });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while signing up' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

// Second Method

import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { name, email, password } = req.body;

  const { db } = await connectToDatabase();

  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await db.collection('users').insertOne({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: 'User created', user: result.ops[0] });
}