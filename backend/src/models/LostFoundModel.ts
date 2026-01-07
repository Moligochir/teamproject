import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LostFoundSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, require: true, ref: "User" },
    id: ObjectId,
    role: { type: String, enum: ["Lost", "Found"] },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: String,
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    image: { type: String, require: true },
    location: { type: String, require: true },
    description: String,
    PostDate: { type: Date, default: Date.now },
    bertelteiEsekh: String,
    breed: { type: String },
  },
  { timestamps: true }
);
export const LostFoundModel = mongoose.model("LostFound", LostFoundSchema);
