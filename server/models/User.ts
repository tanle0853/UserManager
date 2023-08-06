import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    password: String,
    done: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("user", userSchema);
