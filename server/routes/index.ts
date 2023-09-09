import { Router } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { Password } from '../password';
import { Types } from "mongoose";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v4 as uuid } from 'uuid';

dotenv.config();

const router = Router();
router.use(cookieParser());

const _createRefreshToken = async (userId: Types.ObjectId): Promise<string> => {
  try {
    const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';
    const refreshToken = uuid();
    const expiresIn = '1d'; // Thời hạn là 1 ngày

    const newRefreshToken = new RefreshToken({ userId, token: refreshToken });
    await newRefreshToken.save();

    // Tạo token với thời hạn
    const token = jwt.sign({ userId }, secretKey, { expiresIn });

    return token;
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
    const hashedPassword = await Password.hash(password); // Mã hóa mật khẩu trước khi lưu trữ
    const newUser = new User({ username, password: hashedPassword }); // Lưu trữ mật khẩu đã được mã hóa
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
    if (password === undefined) {
      return res.status(401).json({ message: "Password is undefined" });
    }
    const isPasswordValid = await Password.verify(String(password), String(user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Xác minh mật khẩu thành công, bạn có thể thực hiện các hành động sau đây:

    // 1. Tạo phiên làm việc (session)
    const secretKey = String(process.env.JWT_SECRET);

    // 2. Tạo token xác thực và gửi về cho người dùng
    const token = jwt.sign({ userId: user._id, userName: user.username }, secretKey, {
      expiresIn: "5m",
    });

    // 3. Tạo và gửi Refresh Token vào Cookie
    const refreshToken = _createRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000 }); // 1 ngày

    // 4. Trả về thông tin người dùng đã đăng nhập
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken.token;

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
  const refreshToken = req.cookies.refreshToken.token;
  console.log("refreshToken", refreshToken);
  try {
    await RefreshToken.deleteOne({ refreshToken });
    // Xóa Refresh Token (nếu có) trên máy khách (clear cookie)
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default router;
