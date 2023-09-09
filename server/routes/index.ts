import { Router } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { Password } from '../password';
import { Types } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const createRefreshToken = async (userId: Types.ObjectId): Promise<string> => {
  try {
    const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';
    const refreshToken = jwt.sign({ userId }, secretKey, { expiresIn: "7d" });

    const newRefreshToken = new RefreshToken({ userId, token: refreshToken });
    await newRefreshToken.save();

    return refreshToken;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create refresh token");
  }
};

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await Password.verify(String(password), String(user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Xác minh mật khẩu thành công, bạn có thể thực hiện các hành động sau đây:

    // 1. Tạo phiên làm việc (session)
    //req.session.userId = user._id;

    // 2. Tạo token xác thực và gửi về cho người dùng
    //const token = generateAuthToken(user); // Điều này đòi hỏi một hàm để tạo token xác thực

    // 3. Trả về thông tin người dùng đã đăng nhập
    //res.json({ message: "Login successful", user, token });
    res.json({ message: "Login successful", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});


router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }
  try {
    const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';

    let decodedToken;
    try {
      decodedToken = jwt.verify(refreshToken, secretKey) as { userId: string };
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { userId } = decodedToken;

    const storedRefreshToken = await RefreshToken.findOne({ userId, token: refreshToken });

    if (!storedRefreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ userId }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ message: "Access token refreshed", accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    await RefreshToken.deleteOne({ token: refreshToken });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default router;
