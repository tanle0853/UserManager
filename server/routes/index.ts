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
      expiresIn: "5m",
    });

    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
// Tạo và lưu trữ Refresh Token khi người dùng đăng nhập
const createRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Ví dụ: Refresh Token hết hạn sau 7 ngày
  });
  // Lưu refreshToken vào cơ sở dữ liệu, ví dụ MongoDB
  await RefreshToken.create({ userId, token: refreshToken });
  return refreshToken;
};

// Xử lý việc làm mới Access Token bằng Refresh Token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  try {
    // Kiểm tra tính hợp lệ của Refresh Token và lấy userId từ nó
    const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Kiểm tra xem Refresh Token có tồn tại trong cơ sở dữ liệu không
    const storedRefreshToken = await RefreshToken.findOne({ userId, token: refreshToken });

    if (!storedRefreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Tạo một Access Token mới
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
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
    // Xóa Refresh Token khỏi cơ sở dữ liệu
    await RefreshToken.deleteOne({ token: refreshToken });

    // Xóa Access Token và Refresh Token (nếu có) trên máy khách (clear cookie)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Hủy session hoặc thực hiện các hành động đăng xuất khác

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});


export default router;
