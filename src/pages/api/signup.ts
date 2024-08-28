import { connectToDatabase } from '../../lib/db';
import User from '../../models/User';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(422).json({ message: 'Incomplete data' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
