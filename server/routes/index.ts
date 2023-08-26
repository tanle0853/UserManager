import { Router } from "express";
import User from "../models/User";

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

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Thực hiện logic đăng nhập ở đây, ví dụ như tạo session hoặc JWT token

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }

  // API đăng xuất
  router.post("/logout", (req, res) => {
    // Thực hiện logic đăng xuất ở đây, ví dụ như xóa session hoặc hủy JWT token

    res.json({ message: "Logout successful" });
  });

});



export default router;
