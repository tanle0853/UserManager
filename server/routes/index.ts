import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Password } from '../password';


const router = Router();

router.get("/user", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/user", async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  const savedUser = await newUser.save();
  res.json(savedUser);
});

router.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.put("/user/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedUser);
});

router.delete("/user/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
});

// API đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (password === undefined) {
      return res.status(401).json({ message: "Password is undefined" });
    }

    const isPasswordValid = await Password.verify(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const secretKey = process.env.JWT_SECRET;

    // Tiếp tục xử lý đăng nhập thành công
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});


// API đăng xuất
router.post("/logout", (req, res) => {
  // Thực hiện logic đăng xuất ở đây, ví dụ như xóa session hoặc hủy JWT token

  res.json({ message: "Logout successful" });
});

export default router;
