import mongoose, { mongo } from "mongoose";
const MatchSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostFound",
      required: true,
    },
    score: {
      type: Number, // 0–100
      required: true,
    },
  },
  { _id: false },
);
const LostFoundSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: mongoose.Schema.Types.String,
      require: true,
      ref: "User",
    },
    role: { type: String, enum: ["Lost", "Found", "Adopt"] },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: String,
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    image: String,
    lat: Number,
    lng: Number,
    location: String,
    description: String,
    Date: Date,
    breed: { type: String },
    phonenumber: Number,
    matches: { type: [MatchSchema], default: [] },
  },
  { timestamps: true },
);
export const LostFoundModel = mongoose.model("LostFound", LostFoundSchema);
