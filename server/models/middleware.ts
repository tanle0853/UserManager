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
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};


export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Authenticate Token Middleware');
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const secretKey: Secret = process.env.JWT_SECRET || 'default-secret-key';

  try {
    const decodedToken = jwt.verify(token, secretKey) as { userId: string };
    const user = await User.findById(decodedToken.userId);

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

