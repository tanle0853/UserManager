import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'user' | 'admin';
  done: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Thêm trường role
    done: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IUser>("user", userSchema);
