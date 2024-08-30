import { connectToDatabase } from "../../lib/db";
import User from "../../models/User";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(422).json({ message: "Incomplete data" });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res.status(422).json({ message: "User already exists" });
      }

      const hashedPassword = await hash(password, 10);

      // it checks if the role sent in the req is either admin or user
      const validRole = role === "admin" ? "admin" : "user";

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: validRole,
        createdAt: new Date(),
      });

      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "GET") {
    try {
      await connectToDatabase();

      const users = await User.find({}).exec();

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);

      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
  if (req.method === "PUT") {
    try {
      await connectToDatabase();

      const { _id, username, email, password, role, createdAt } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const updateData = { username, email, password, role, createdAt };

      if (password) {
        const hashedPassword = await hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
        new: true,
      }).exec();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDatabase();

      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const deletedUser = await User.findByIdAndDelete(userId).exec();

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
