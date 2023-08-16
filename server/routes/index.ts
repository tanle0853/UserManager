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

export default router;
