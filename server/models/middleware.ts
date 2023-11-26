// middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import dotenv from 'dotenv';

// Load biến môi trường từ tệp .env
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null | undefined;
    }
  }
}
const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';
export const checkRole = (roles: ('user' | 'admin')[]) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.header('Authorization');
  const parts: any = token?.toString().split(" "); // Tách chuỗi thành mảng sử dụng khoảng trắng làm dấu phân cách
  const tokenWithoutBearer = parts[1];
  console.log('anh ban toi la tan day', tokenWithoutBearer);
  console.log("sau khi", secretKey);

  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {

    const decodedToken = jwt.verify(tokenWithoutBearer, secretKey) as { userId: string };
    console.log("decodedToken", decodedToken);
    const user = await User.findById(decodedToken.userId);
    console.log("user", user);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid token" });
  }
};

