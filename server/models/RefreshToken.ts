import mongoose, { Document, Model, Schema } from "mongoose";

// Define the RefreshToken schema
const refreshTokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the RefreshToken document interface
interface IRefreshToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

// Define the RefreshToken model
const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
