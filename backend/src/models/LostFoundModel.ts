import mongoose, { mongo } from "mongoose";

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
    imageEmbedding: {
      type: [Number],
      default: [],
    },
    matchScore: Number,
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostFound",
      default: null,
    },
    matches: {
      type: [
        {
          postId: { type: mongoose.Schema.Types.ObjectId, ref: "LostFound" },
          score: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);
export const LostFoundModel = mongoose.model("LostFound", LostFoundSchema);
