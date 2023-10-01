// middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null | undefined;
    }
  }
}

export const checkRole = (role: 'user' | 'admin') => (req: Request, res: Response, next: NextFunction) => {
  // Sử dụng NonNullable để loại bỏ khả năng giá trị null
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';

  jwt.verify(token, secretKey, async (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Lưu thông tin người dùng vào đối tượng req
    req.user = await User.findById((user as { userId: string }).userId);
    next();
  });
};
