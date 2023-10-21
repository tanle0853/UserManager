import { Router, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { Password } from '../password';
import { Types } from "mongoose";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v4 as uuid } from 'uuid';
import { checkRole, authenticateToken } from '../models/middleware';

// Đọc biến môi trường từ tệp .env
dotenv.config();

const router = Router();
router.use(cookieParser());
const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';
const _createRefreshToken = async (userId: Types.ObjectId): Promise<string> => {
  try {
    // Kiểm tra nếu Refresh Token tồn tại cho userId
    const existingRefreshToken = await RefreshToken.findOne({ userId });

    if (existingRefreshToken) {
      const currentDateTime = new Date();

      // Kiểm tra xem Refresh Token có hết hạn hay không
      if (existingRefreshToken.createdAt <= currentDateTime) {
        // Xóa Refresh Token nếu nó đã hết hạn
        await RefreshToken.deleteOne({ userId });
      }
    }

    // Tiếp tục với việc tạo mới Refresh Token và Token truy cập (nếu cần)

    const refreshToken = uuid();
    const expiresIn = '1d'; // Thời hạn của Token truy cập là 1 ngày

    const newRefreshToken = new RefreshToken({ userId, token: refreshToken });

    // Đặt thời hạn cho Refresh Token
    const refreshExpiration = new Date();
    refreshExpiration.setDate(refreshExpiration.getDate() + 1); // 1 ngày sau
    newRefreshToken.createdAt = refreshExpiration;

    await newRefreshToken.save();

    // Tạo Token truy cập với thời hạn
    const token = jwt.sign({ userId }, secretKey, { expiresIn });

    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create or remove refresh token");
  }
};

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

    // 1. Sử dụng cùng một secretKey từ biến môi trường
    console.log("truoc khi", secretKey);
    // 2. Tạo token xác thực và gửi về cho người dùng
    const token = jwt.sign({ userId: user._id, userName: user.username }, secretKey, {
      expiresIn: "2h",
    });
    console.log("token", token);

    // 3. Tạo và gửi Refresh Token vào Cookie
    const refreshToken = _createRefreshToken(user._id); // Truyền secretKey vào hàm
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000 }); // 1 ngày

    // 4. Trả về thông tin người dùng đã đăng nhập
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});


router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }
  try {

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
  const refreshToken = req.cookies.refreshToken;
  console.log("refreshToken", refreshToken);
  try {
    // Lấy thông tin user dựa trên refreshToken
    const refreshTokenDoc = await RefreshToken.findOne({ refreshToken });

    if (!refreshTokenDoc) {
      // Nếu không tìm thấy refreshToken, có thể xem là đã logout thành công
      res.json({ message: "Logout successful" });
      return;
    }

    // Xóa refreshToken tương ứng khỏi cơ sở dữ liệu
    await RefreshToken.deleteOne({ refreshToken });

    // Xóa Refresh Token trên máy khách (clear cookie)
    res.clearCookie("refreshToken");

    // Đồng thời, bạn cũng có thể xóa AccessToken nếu bạn muốn
    // Ví dụ: await AccessToken.deleteOne({ userId: refreshTokenDoc.userId });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/user/search/:username", async (req, res) => {
  try {
    const username = req.params.username;
    let query = {}; // Đây là truy vấn mặc định, tìm tất cả người dùng
    if (username) {
      query = { username: { $regex: username, $options: 'i' } };
    }
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.use(authenticateToken);
router.get("/user", checkRole('admin'), async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
;

router.post("/user", checkRole('admin'), async (req: Request, res: Response) => {
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

router.get("/user/:id", checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.put("/user/:id", checkRole('admin'), async (req, res) => {
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

router.delete("/user/:id", checkRole('admin'), async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

export default router;
