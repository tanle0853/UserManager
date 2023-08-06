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

export default router;
