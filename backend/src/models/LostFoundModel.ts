import mongoose from "mongoose";

const LostFoundSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: mongoose.Schema.Types.String,
      require: true,
      ref: "User",
    },
    role: { type: String, enum: ["Lost", "Found"] },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: String,
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    image: String,
    location: String,
    description: String,
    Date: Date,
    breed: { type: String },
  },
  { timestamps: true }
);
export const LostFoundModel = mongoose.model("LostFound", LostFoundSchema);
