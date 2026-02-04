import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    petType: {
      type: String,
      enum: ["Dog", "Cat"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    phonenumber: {
      type: Number,
    },
    // ✅ NEW FIELD - Hide/Unhide posts
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const LostFoundModel = mongoose.model("LostFound", lostFoundSchema);
